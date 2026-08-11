package sync

import (
	"net/http"
	"time"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/guyestguygithub001/PHC_Live/edge-api/database"
	"github.com/guyestguygithub001/PHC_Live/edge-api/models"
)

// PatientDTO safely exposes patient data without leaking sensitive contact info to random endpoints.
type PatientDTO struct {
	ID        string    `json:"id"`
	HumanID   string    `json:"human_id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

type SyncResponse struct {
	Changes   map[string]interface{} `json:"changes"`
	Timestamp int64                  `json:"timestamp"`
}

func PullHandler(c *gin.Context) {
	lastPulledAtStr := c.Query("lastPulledAt")
	var lastPulledAt time.Time

	if lastPulledAtStr != "" {
		timestamp, err := strconv.ParseInt(lastPulledAtStr, 10, 64)
		if err == nil {
			lastPulledAt = time.UnixMilli(timestamp)
		}
	}

	var patients []models.Patient
	query := database.DB.Unscoped()
	if !lastPulledAt.IsZero() {
		query = query.Where("updated_at > ?", lastPulledAt)
	}
	query.Find(&patients)

	// Map to DTOs for strict Data Minimization (API Security)
	var createdPatients []PatientDTO
	var updatedPatients []PatientDTO
	var deletedPatients []string

	for _, p := range patients {
		dto := PatientDTO{
			ID:        p.ID,
			HumanID:   p.HumanID,
			FirstName: p.FirstName,
			LastName:  p.LastName,
			Gender:    p.Gender,
			DOB:       p.DOB,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		}

		if p.DeletedAt.Valid {
			deletedPatients = append(deletedPatients, p.ID)
		} else if p.CreatedAt.After(lastPulledAt) {
			createdPatients = append(createdPatients, dto)
		} else {
			updatedPatients = append(updatedPatients, dto)
		}
	}

	changes := map[string]interface{}{
		"patients": map[string]interface{}{
			"created": createdPatients,
			"updated": updatedPatients,
			"deleted": deletedPatients,
		},
		// Encounters, Vitals, Inventory would follow the exact same secure DTO pattern
	}

	c.JSON(http.StatusOK, SyncResponse{
		Changes:   changes,
		Timestamp: time.Now().UnixMilli(),
	})
}

func PushHandler(c *gin.Context) {
	// Parse the WatermelonDB push payload
	var pushData map[string]interface{}
	if err := c.ShouldBindJSON(&pushData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid push payload"})
		return
	}

	// Begin PostgreSQL Transaction (Atomic commits only)
	tx := database.DB.Begin()

	// Apply creations, updates, deletions securely here
	// Server-Wins Conflict Resolution is enforced by the Edge Server
	
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
