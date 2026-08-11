package sync

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/guyestguygithub001/PHC_Live/edge-api/database"
	"github.com/guyestguygithub001/PHC_Live/edge-api/models"
)

type PullResponse struct {
	Changes   map[string]interface{} `json:"changes"`
	Timestamp int64                  `json:"timestamp"`
}

func PullHandler(c *gin.Context) {
	// The client (WatermelonDB) sends `lastPulledAt` to get only new records
	// lastPulledAt := c.Query("lastPulledAt")
	
	// Mock implementation for WatermelonDB sync protocol
	changes := map[string]interface{}{
		"patients": map[string]interface{}{
			"created": []models.Patient{},
			"updated": []models.Patient{},
			"deleted": []string{},
		},
		"encounters": map[string]interface{}{
			"created": []models.Encounter{},
			"updated": []models.Encounter{},
			"deleted": []string{},
		},
	}

	c.JSON(http.StatusOK, PullResponse{
		Changes:   changes,
		Timestamp: 1690000000000, // Current timestamp
	})
}

func PushHandler(c *gin.Context) {
	// In a real scenario, you parse the incoming changes and apply them inside a DB Transaction
	var pushData map[string]interface{}
	if err := c.ShouldBindJSON(&pushData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid push payload"})
		return
	}

	tx := database.DB.Begin()

	// Apply creations, updates, deletions to PostgreSQL using GORM
	// Example: parse pushData["patients"]["created"] and tx.Create(&patients)

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
