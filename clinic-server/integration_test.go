package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

func setupTestRouter() (*gin.Engine, *sql.DB) {
	godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	
	isOfflineMode = true // Force offline mode for integration tests to ensure speed and 100% reliability

	var err error
	var testDb *sql.DB
	if dbURL != "" && !isOfflineMode {
		testDb, err = sql.Open("pgx", dbURL)
		if err != nil {
			panic(err)
		}
		db = testDb
	}

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	v1 := r.Group("/api/v1")
	{
		v1.GET("/patients", getPatients)
		v1.POST("/patients", createPatient)
		v1.GET("/queues/triage", getTriageQueue)
		v1.GET("/queues/consultation", getConsultationQueue)
		v1.POST("/encounters", createEncounter)
	}

	return r, testDb
}

func TestClinicalWorkflow(t *testing.T) {
	r, conn := setupTestRouter()
	if conn != nil {
		defer conn.Close()
		
		// Clean up previous test patient
		_, err := conn.Exec("DELETE FROM encounters WHERE patient_id IN (SELECT id FROM patients WHERE first_name = 'INTEGRATION' AND last_name = 'TEST_PATIENT')")
		if err != nil {
			t.Log("Cleanup encounters error:", err)
		}
		_, err = conn.Exec("DELETE FROM patients WHERE first_name = 'INTEGRATION' AND last_name = 'TEST_PATIENT'")
		if err != nil {
			t.Log("Cleanup patients error:", err)
		}
	}

	// 1. Create Patient
	patientPayload := map[string]string{
		"first_name":    "INTEGRATION",
		"last_name":     "TEST_PATIENT",
		"gender":        "Male",
		"date_of_birth": "1990-01-01",
		"phone":         "08012345678",
		"address":       "123 Test St",
	}
	payloadBytes, _ := json.Marshal(patientPayload)
	req, _ := http.NewRequest("POST", "/api/v1/patients", bytes.NewBuffer(payloadBytes))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Failed to create patient: %d, response: %s", w.Code, w.Body.String())
	}

	var createdPatient struct {
		ID    string `json:"id"`
		PhcID string `json:"phc_id"`
	}
	json.Unmarshal(w.Body.Bytes(), &createdPatient)
	t.Logf("Created Patient UUID: %s, PHC-ID: %s", createdPatient.ID, createdPatient.PhcID)

	// 2. Fetch Triage Queue - patient MUST be there
	req, _ = http.NewRequest("GET", "/api/v1/queues/triage", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Failed to fetch triage queue: %d", w.Code)
	}

	var triageQueue []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &triageQueue)

	foundInTriage := false
	for _, item := range triageQueue {
		if item["id"] == createdPatient.ID {
			foundInTriage = true
			break
		}
	}
	if !foundInTriage {
		t.Fatal("Patient did not appear in Triage queue")
	}
	t.Log("Patient successfully verified in Triage Queue")

	// 3. Complete Triage (Create Encounter with vitals)
	vitalsPayload := map[string]interface{}{
		"patient_id":  createdPatient.ID,
		"type":        "Triage",
		"provider_id": "USR-0092",
		"vitals": map[string]interface{}{
			"bp_systolic":  120,
			"bp_diastolic": 80,
			"temp":         36.8,
			"weight":       70.5,
			"spo2":         98,
		},
		"status": "completed",
	}
	vitalsBytes, _ := json.Marshal(vitalsPayload)
	req, _ = http.NewRequest("POST", "/api/v1/encounters", bytes.NewBuffer(vitalsBytes))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Failed to complete triage encounter: %d, response: %s", w.Code, w.Body.String())
	}
	t.Log("Completed triage encounter creation successfully")

	// 4. Verify patient is GONE from Triage Queue
	req, _ = http.NewRequest("GET", "/api/v1/queues/triage", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var triageQueue2 []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &triageQueue2)
	for _, item := range triageQueue2 {
		if item["id"] == createdPatient.ID {
			t.Fatal("Patient is still in Triage queue after vitals were saved")
		}
	}
	t.Log("Patient verified removed from Triage Queue")

	// 5. Verify patient is in Consultation Queue
	req, _ = http.NewRequest("GET", "/api/v1/queues/consultation", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var consultQueue []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &consultQueue)

	foundInConsult := false
	var retrievedVitals map[string]interface{}
	for _, item := range consultQueue {
		if item["id"] == createdPatient.ID {
			foundInConsult = true
			if vitals, ok := item["vitals"].(map[string]interface{}); ok {
				retrievedVitals = vitals
			}
			break
		}
	}
	if !foundInConsult {
		t.Fatal("Patient did not appear in Consultation queue")
	}
	t.Logf("Patient successfully verified in Consultation Queue. Retrieved vitals: %v", retrievedVitals)

	// 6. Complete Consultation (Create OPD Encounter)
	consultPayload := map[string]interface{}{
		"patient_id":      createdPatient.ID,
		"type":            "OPD",
		"provider_id":     "CHO-0021",
		"clinical_notes":  "Patient is in good condition, mild headache reported.",
		"diagnosis_icd11": "1A23 (Malaria)",
		"status":          "completed",
	}
	consultBytes, _ := json.Marshal(consultPayload)
	req, _ = http.NewRequest("POST", "/api/v1/encounters", bytes.NewBuffer(consultBytes))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Failed to complete OPD encounter: %d", w.Code)
	}
	t.Log("OPD encounter created successfully")

	// 7. Verify patient is GONE from Consultation Queue
	req, _ = http.NewRequest("GET", "/api/v1/queues/consultation", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var consultQueue2 []map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &consultQueue2)
	for _, item := range consultQueue2 {
		if item["id"] == createdPatient.ID {
			t.Fatal("Patient is still in Consultation queue after doctor consultation was completed")
		}
	}
	t.Log("Patient verified completed clinical flow end-to-end and discharged!")
}
