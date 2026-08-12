package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Patient struct {
	ID              string    `json:"id"`
	PhcID           string    `json:"phc_id"`
	FirstName       string    `json:"first_name"`
	LastName        string    `json:"last_name"`
	Phone           string    `json:"phone"`
	Gender          string    `json:"gender"`
	DateOfBirth     string    `json:"date_of_birth"`
	Tribe           string    `json:"tribe"`
	Religion        string    `json:"religion"`
	Occupation      string    `json:"occupation"`
	Address         string    `json:"address"`
	NextOfKinName   string    `json:"next_of_kin_name"`
	NextOfKinPhone  string    `json:"next_of_kin_phone"`
	CreatedAt       time.Time `json:"created_at"`
}

func getPatients(c *gin.Context) {
	rows, err := db.Query("SELECT id, phc_id, first_name, last_name, phone, gender, date_of_birth, tribe, religion, occupation, address, next_of_kin_name, next_of_kin_phone, created_at FROM patients WHERE is_archived = false ORDER BY created_at DESC LIMIT 50")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	patients := []Patient{}
	for rows.Next() {
		var p Patient
		var dob sqlNullString
		if err := rows.Scan(&p.ID, &p.PhcID, &p.FirstName, &p.LastName, &p.Phone, &p.Gender, &dob, &p.Tribe, &p.Religion, &p.Occupation, &p.Address, &p.NextOfKinName, &p.NextOfKinPhone, &p.CreatedAt); err != nil {
			continue
		}
		p.DateOfBirth = dob.String
		patients = append(patients, p)
	}

	c.JSON(http.StatusOK, patients)
}

func createPatient(c *gin.Context) {
	var input struct {
		FirstName       string `json:"first_name" binding:"required"`
		LastName        string `json:"last_name" binding:"required"`
		Gender          string `json:"gender"`
		DateOfBirth     string `json:"date_of_birth"`
		Tribe           string `json:"tribe"`
		Religion        string `json:"religion"`
		Occupation      string `json:"occupation"`
		Address         string `json:"address"`
		Phone           string `json:"phone"`
		NextOfKinName   string `json:"next_of_kin_name"`
		NextOfKinPhone  string `json:"next_of_kin_phone"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate PHC_ID
	var count int
	err := db.QueryRow("SELECT count(*) FROM patients").Scan(&count)
	if err != nil {
		count = 0
	}
	phcID := fmt.Sprintf("PHC-KAN-%04d", count+1)

	var p Patient
	err = db.QueryRow(`
		INSERT INTO patients (
			phc_id, first_name, last_name, phone, gender, date_of_birth,
			tribe, religion, occupation, address, next_of_kin_name, next_of_kin_phone
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, phc_id, first_name, last_name, phone, gender, created_at
	`, phcID, input.FirstName, input.LastName, input.Phone, input.Gender, input.DateOfBirth,
		input.Tribe, input.Religion, input.Occupation, input.Address, input.NextOfKinName, input.NextOfKinPhone).
		Scan(&p.ID, &p.PhcID, &p.FirstName, &p.LastName, &p.Phone, &p.Gender, &p.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create patient"})
		return
	}

	c.JSON(http.StatusCreated, p)
}

// dhis2SyncHandler mocks pushing aggregated disease data to the national DHIS2 server.
func dhis2SyncHandler(c *gin.Context) {
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In a real scenario, this would query the DB for monthly aggregated data
	// and POST it to the DHIS2 API with Basic Auth.
	// We'll mock the success response.
	time.Sleep(1 * time.Second) // Simulate network delay

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Aggregated data synced to DHIS2 successfully",
		"timestamp": time.Now().Format(time.RFC3339),
		"synced_programs": []string{"malaria", "hiv", "tb", "hypertension", "diabetes"},
	})
}

// sqlNullString helper for nullable DB strings
type sqlNullString struct {
	String string
	Valid  bool
}
func (ns *sqlNullString) Scan(value interface{}) error {
	if value == nil {
		ns.String, ns.Valid = "", false
		return nil
	}
	ns.String, ns.Valid = string(value.([]byte)), true
	return nil
}
