package main

import (
	"encoding/json"
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


var (
	isOfflineMode         = false
	inMemoryPatients      = []Patient{}
	inMemoryEncounters    = []Encounter{}
	inMemoryLabRequests   = []LabRequest{}
	inMemoryPrescriptions = []Prescription{}
)

type Encounter struct {
	ID             string    `json:"id"`
	PatientID      string    `json:"patient_id"`
	Type           string    `json:"type"`
	ProviderID     string    `json:"provider_id"`
	Vitals         string    `json:"vitals"` // raw JSON string
	ClinicalNotes  string    `json:"clinical_notes"`
	DiagnosisICD11 string    `json:"diagnosis_icd11"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
}

type LabRequest struct {
	ID          string    `json:"id"`
	EncounterID string    `json:"encounter_id"`
	PatientID   string    `json:"patient_id"`
	TestType    string    `json:"test_type"`
	OrderedBy   string    `json:"ordered_by"`
	Priority    string    `json:"priority"`
	Status      string    `json:"status"`
	Result      string    `json:"result"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
}

type Prescription struct {
	ID                 string    `json:"id"`
	EncounterID        string    `json:"encounter_id"`
	PatientID          string    `json:"patient_id"`
	DrugID             string    `json:"drug_id"`
	DosageInstructions string    `json:"dosage_instructions"`
	QuantityPrescribed int       `json:"quantity_prescribed"`
	Status             string    `json:"status"`
	PrescribedBy       string    `json:"prescribed_by"`
	CreatedAt          time.Time `json:"created_at"`
}

func init() {
	inMemoryPatients = []Patient{
		{
			ID:             "uuid-pat-1",
			PhcID:          "PHC-KAN-0001",
			FirstName:      "Fatima",
			LastName:       "Abubakar",
			Gender:         "Female",
			DateOfBirth:    "1995-04-12",
			Phone:          "08099887766",
			Address:        "Gwagwalada, Abuja",
			NextOfKinName:  "Abubakar Sadiq",
			NextOfKinPhone: "08011223344",
			CreatedAt:      time.Now().Add(-2 * time.Hour),
		},
		{
			ID:             "uuid-pat-2",
			PhcID:          "PHC-KAN-0002",
			FirstName:      "Musa",
			LastName:       "Ibrahim",
			Gender:         "Male",
			DateOfBirth:    "1988-11-23",
			Phone:          "07011223344",
			Address:        "Jos Plateau",
			NextOfKinName:  "Sarah Ibrahim",
			NextOfKinPhone: "07099887766",
			CreatedAt:      time.Now().Add(-1 * time.Hour),
		},
	}
}

func getPatients(c *gin.Context) {
	if isOfflineMode {
		c.JSON(http.StatusOK, inMemoryPatients)
		return
	}
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
		FirstName      string `json:"first_name" binding:"required"`
		LastName       string `json:"last_name" binding:"required"`
		Gender         string `json:"gender"`
		DateOfBirth    string `json:"date_of_birth"`
		Tribe          string `json:"tribe"`
		Religion       string `json:"religion"`
		Occupation     string `json:"occupation"`
		Address        string `json:"address"`
		Phone          string `json:"phone"`
		NextOfKinName  string `json:"next_of_kin_name"`
		NextOfKinPhone string `json:"next_of_kin_phone"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		var p Patient
		p.ID = fmt.Sprintf("uuid-pat-%d", len(inMemoryPatients)+1)
		p.PhcID = fmt.Sprintf("PHC-KAN-%04d", len(inMemoryPatients)+1)
		p.FirstName = input.FirstName
		p.LastName = input.LastName
		p.Gender = input.Gender
		p.DateOfBirth = input.DateOfBirth
		p.Phone = input.Phone
		p.Address = input.Address
		p.Tribe = input.Tribe
		p.Religion = input.Religion
		p.Occupation = input.Occupation
		p.NextOfKinName = input.NextOfKinName
		p.NextOfKinPhone = input.NextOfKinPhone
		p.CreatedAt = time.Now()

		inMemoryPatients = append(inMemoryPatients, p)
		c.JSON(http.StatusCreated, p)
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

func getTriageQueue(c *gin.Context) {
	if isOfflineMode {
		triageCompleted := make(map[string]bool)
		for _, e := range inMemoryEncounters {
			if e.Type == "Triage" {
				triageCompleted[e.PatientID] = true
			}
		}
		queue := []Patient{}
		for _, p := range inMemoryPatients {
			if !triageCompleted[p.ID] {
				queue = append(queue, p)
			}
		}
		c.JSON(http.StatusOK, queue)
		return
	}

	rows, err := db.Query(`
		SELECT id, phc_id, first_name, last_name, phone, gender, date_of_birth, created_at 
		FROM patients 
		WHERE is_archived = false 
		  AND id NOT IN (
		      SELECT DISTINCT patient_id FROM encounters 
		      WHERE type = 'Triage' AND created_at >= NOW() - INTERVAL '1 day'
		  )
		ORDER BY created_at ASC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	patients := []Patient{}
	for rows.Next() {
		var p Patient
		var dob sqlNullString
		if err := rows.Scan(&p.ID, &p.PhcID, &p.FirstName, &p.LastName, &p.Phone, &p.Gender, &dob, &p.CreatedAt); err != nil {
			continue
		}
		p.DateOfBirth = dob.String
		patients = append(patients, p)
	}
	c.JSON(http.StatusOK, patients)
}

func getConsultationQueue(c *gin.Context) {
	if isOfflineMode {
		triageVitals := make(map[string]interface{})
		for _, e := range inMemoryEncounters {
			if e.Type == "Triage" {
				var vitalsMap map[string]interface{}
				json.Unmarshal([]byte(e.Vitals), &vitalsMap)
				triageVitals[e.PatientID] = vitalsMap
			}
		}

		opdCompleted := make(map[string]bool)
		for _, e := range inMemoryEncounters {
			if e.Type == "OPD" {
				opdCompleted[e.PatientID] = true
			}
		}

		type Item struct {
			ID          string      `json:"id"`
			PhcID       string      `json:"phc_id"`
			FirstName   string      `json:"first_name"`
			LastName    string      `json:"last_name"`
			Phone       string      `json:"phone"`
			Gender      string      `json:"gender"`
			DateOfBirth string      `json:"date_of_birth"`
			Vitals      interface{} `json:"vitals"`
		}

		queue := []Item{}
		for _, p := range inMemoryPatients {
			if triageVitals[p.ID] != nil && !opdCompleted[p.ID] {
				queue = append(queue, Item{
					ID:          p.ID,
					PhcID:       p.PhcID,
					FirstName:   p.FirstName,
					LastName:    p.LastName,
					Phone:       p.Phone,
					Gender:      p.Gender,
					DateOfBirth: p.DateOfBirth,
					Vitals:      triageVitals[p.ID],
				})
			}
		}
		c.JSON(http.StatusOK, queue)
		return
	}

	query := `
		SELECT p.id, p.phc_id, p.first_name, p.last_name, p.phone, p.gender, p.date_of_birth, e.vitals
		FROM patients p
		JOIN encounters e ON p.id = e.patient_id
		WHERE e.type = 'Triage'
		  AND e.created_at >= NOW() - INTERVAL '1 day'
		  AND p.id NOT IN (
		      SELECT DISTINCT patient_id FROM encounters 
		      WHERE type = 'OPD' AND created_at >= NOW() - INTERVAL '1 day'
		  )
		ORDER BY e.created_at ASC
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	type Item struct {
		ID          string      `json:"id"`
		PhcID       string      `json:"phc_id"`
		FirstName   string      `json:"first_name"`
		LastName    string      `json:"last_name"`
		Phone       string      `json:"phone"`
		Gender      string      `json:"gender"`
		DateOfBirth string      `json:"date_of_birth"`
		Vitals      interface{} `json:"vitals"`
	}

	items := []Item{}
	for rows.Next() {
		var item Item
		var dob sqlNullString
		var vitalsRaw []byte
		if err := rows.Scan(&item.ID, &item.PhcID, &item.FirstName, &item.LastName, &item.Phone, &item.Gender, &dob, &vitalsRaw); err != nil {
			continue
		}
		item.DateOfBirth = dob.String
		if len(vitalsRaw) > 0 {
			var vitalsMap map[string]interface{}
			if err := json.Unmarshal(vitalsRaw, &vitalsMap); err == nil {
				item.Vitals = vitalsMap
			} else {
				item.Vitals = string(vitalsRaw)
			}
		}
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getLaboratoryQueue(c *gin.Context) {
	if isOfflineMode {
		type LabItem struct {
			ID        string    `json:"id"`
			PatientID string    `json:"patient_id"`
			PhcID     string    `json:"phc_id"`
			Name      string    `json:"name"`
			TestType  string    `json:"test_type"`
			Priority  string    `json:"priority"`
			Status    string    `json:"status"`
			CreatedAt time.Time `json:"created_at"`
		}
		
		items := []LabItem{}
		for _, lr := range inMemoryLabRequests {
			if lr.Status == "pending" {
				name := "Unknown"
				phcID := ""
				for _, p := range inMemoryPatients {
					if p.ID == lr.PatientID {
						name = p.FirstName + " " + p.LastName
						phcID = p.PhcID
						break
					}
				}
				items = append(items, LabItem{
					ID:        lr.ID,
					PatientID: lr.PatientID,
					PhcID:     phcID,
					Name:      name,
					TestType:  lr.TestType,
					Priority:  lr.Priority,
					Status:    lr.Status,
					CreatedAt: lr.CreatedAt,
				})
			}
		}
		c.JSON(http.StatusOK, items)
		return
	}

	query := `
		SELECT lr.id, lr.patient_id, p.phc_id, p.first_name, p.last_name, lr.test_type, lr.priority, lr.status, lr.created_at
		FROM lab_requests lr
		JOIN patients p ON lr.patient_id = p.id
		WHERE lr.status = 'pending'
		ORDER BY lr.created_at ASC
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	type LabItem struct {
		ID        string    `json:"id"`
		PatientID string    `json:"patient_id"`
		PhcID     string    `json:"phc_id"`
		Name      string    `json:"name"`
		TestType  string    `json:"test_type"`
		Priority  string    `json:"priority"`
		Status    string    `json:"status"`
		CreatedAt time.Time `json:"created_at"`
	}

	items := []LabItem{}
	for rows.Next() {
		var item LabItem
		var firstName, lastName string
		if err := rows.Scan(&item.ID, &item.PatientID, &item.PhcID, &firstName, &lastName, &item.TestType, &item.Priority, &item.Status, &item.CreatedAt); err != nil {
			continue
		}
		item.Name = firstName + " " + lastName
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getPharmacyQueue(c *gin.Context) {
	if isOfflineMode {
		type PharmItem struct {
			ID                 string    `json:"id"`
			PatientID          string    `json:"patient_id"`
			PhcID              string    `json:"phc_id"`
			PatientName        string    `json:"patient_name"`
			DrugName           string    `json:"drug_name"`
			DosageInstructions string    `json:"dosage_instructions"`
			QuantityPrescribed int       `json:"quantity_prescribed"`
			Status             string    `json:"status"`
			CreatedAt          time.Time `json:"created_at"`
		}

		items := []PharmItem{}
		for _, pr := range inMemoryPrescriptions {
			if pr.Status == "pending" {
				name := "Unknown"
				phcID := ""
				for _, p := range inMemoryPatients {
					if p.ID == pr.PatientID {
						name = p.FirstName + " " + p.LastName
						phcID = p.PhcID
						break
					}
				}
				items = append(items, PharmItem{
					ID:                 pr.ID,
					PatientID:          pr.PatientID,
					PhcID:              phcID,
					PatientName:        name,
					DrugName:           pr.DrugID,
					DosageInstructions: pr.DosageInstructions,
					QuantityPrescribed: pr.QuantityPrescribed,
					Status:             pr.Status,
					CreatedAt:          pr.CreatedAt,
				})
			}
		}
		c.JSON(http.StatusOK, items)
		return
	}

	query := `
		SELECT pr.id, pr.patient_id, p.phc_id, p.first_name, p.last_name, pr.drug_id, pr.dosage_instructions, pr.quantity_prescribed, pr.status, pr.created_at
		FROM prescriptions pr
		JOIN patients p ON pr.patient_id = p.id
		WHERE pr.status = 'pending'
		ORDER BY pr.created_at ASC
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	type PharmItem struct {
		ID                 string    `json:"id"`
		PatientID          string    `json:"patient_id"`
		PhcID              string    `json:"phc_id"`
		PatientName        string    `json:"patient_name"`
		DrugName           string    `json:"drug_name"`
		DosageInstructions string    `json:"dosage_instructions"`
		QuantityPrescribed int       `json:"quantity_prescribed"`
		Status             string    `json:"status"`
		CreatedAt          time.Time `json:"created_at"`
	}

	items := []PharmItem{}
	for rows.Next() {
		var item PharmItem
		var firstName, lastName string
		if err := rows.Scan(&item.ID, &item.PatientID, &item.PhcID, &firstName, &lastName, &item.DrugName, &item.DosageInstructions, &item.QuantityPrescribed, &item.Status, &item.CreatedAt); err != nil {
			continue
		}
		item.PatientName = firstName + " " + lastName
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getBillingQueue(c *gin.Context) {
	if isOfflineMode {
		type BillItem struct {
			ID            string `json:"id"`
			PhcID         string `json:"phc_id"`
			Name          string `json:"name"`
			PendingAmount int    `json:"pendingAmount"`
		}

		items := []BillItem{}
		for _, p := range inMemoryPatients {
			hasActivity := false
			hasPaid := false
			
			for _, e := range inMemoryEncounters {
				if e.PatientID == p.ID {
					hasActivity = true
					if e.Type == "Payment" {
						hasPaid = true
					}
				}
			}
			for _, lr := range inMemoryLabRequests {
				if lr.PatientID == p.ID {
					hasActivity = true
				}
			}
			for _, pr := range inMemoryPrescriptions {
				if pr.PatientID == p.ID {
					hasActivity = true
				}
			}

			if hasActivity && !hasPaid {
				encCount := 0
				for _, e := range inMemoryEncounters {
					if e.PatientID == p.ID {
						encCount++
					}
				}
				labCount := 0
				for _, lr := range inMemoryLabRequests {
					if lr.PatientID == p.ID {
						labCount++
					}
				}
				prescCount := 0
				for _, pr := range inMemoryPrescriptions {
					if pr.PatientID == p.ID {
						prescCount++
					}
				}

				amount := (encCount * 500) + (labCount * 1000) + (prescCount * 1500)
				if amount > 0 {
					items = append(items, BillItem{
						ID:            p.ID,
						PhcID:         p.PhcID,
						Name:          p.FirstName + " " + p.LastName,
						PendingAmount: amount,
					})
				}
			}
		}
		c.JSON(http.StatusOK, items)
		return
	}

	query := `
		SELECT p.id, p.phc_id, p.first_name, p.last_name, 
		       COALESCE((SELECT COUNT(*) FROM encounters WHERE patient_id = p.id AND created_at >= NOW() - INTERVAL '1 day') * 500, 0) +
		       COALESCE((SELECT COUNT(*) FROM lab_requests WHERE patient_id = p.id AND created_at >= NOW() - INTERVAL '1 day') * 1000, 0) +
		       COALESCE((SELECT COUNT(*) FROM prescriptions WHERE patient_id = p.id AND created_at >= NOW() - INTERVAL '1 day') * 1500, 0) AS pending_amount
		FROM patients p
		WHERE p.is_archived = false
		  AND p.id IN (
		      SELECT DISTINCT patient_id FROM encounters WHERE created_at >= NOW() - INTERVAL '1 day'
		      UNION
		      SELECT DISTINCT patient_id FROM lab_requests WHERE created_at >= NOW() - INTERVAL '1 day'
		      UNION
		      SELECT DISTINCT patient_id FROM prescriptions WHERE created_at >= NOW() - INTERVAL '1 day'
		  )
		  AND p.id NOT IN (
		      SELECT DISTINCT patient_id FROM encounters 
		      WHERE type = 'Payment' AND created_at >= NOW() - INTERVAL '1 day'
		  )
	`
	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	type BillItem struct {
		ID            string `json:"id"`
		PhcID         string `json:"phc_id"`
		Name          string `json:"name"`
		PendingAmount int    `json:"pendingAmount"`
	}

	items := []BillItem{}
	for rows.Next() {
		var item BillItem
		var firstName, lastName string
		if err := rows.Scan(&item.ID, &item.PhcID, &firstName, &lastName, &item.PendingAmount); err != nil {
			continue
		}
		item.Name = firstName + " " + lastName
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func createEncounter(c *gin.Context) {
	var input struct {
		PatientID      string      `json:"patient_id" binding:"required"`
		Type           string      `json:"type" binding:"required"`
		ProviderID     string      `json:"provider_id"`
		Vitals         interface{} `json:"vitals"`
		ClinicalNotes  string      `json:"clinical_notes"`
		DiagnosisICD11 string      `json:"diagnosis_icd11"`
		Status         string      `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		vitalsJSON := "{}"
		if input.Vitals != nil {
			bytes, err := json.Marshal(input.Vitals)
			if err == nil {
				vitalsJSON = string(bytes)
			}
		}
		e := Encounter{
			ID:             fmt.Sprintf("uuid-enc-%d", len(inMemoryEncounters)+1),
			PatientID:      input.PatientID,
			Type:           input.Type,
			ProviderID:     input.ProviderID,
			Vitals:         vitalsJSON,
			ClinicalNotes:  input.ClinicalNotes,
			DiagnosisICD11: input.DiagnosisICD11,
			Status:         "completed",
			CreatedAt:      time.Now(),
		}
		inMemoryEncounters = append(inMemoryEncounters, e)
		c.JSON(http.StatusCreated, gin.H{"status": "success", "encounter_id": e.ID})
		return
	}

	vitalsJSON := "{}"
	if input.Vitals != nil {
		bytes, err := json.Marshal(input.Vitals)
		if err == nil {
			vitalsJSON = string(bytes)
		}
	}

	status := "completed"
	if input.Status != "" {
		status = input.Status
	}

	var encounterID string
	err := db.QueryRow(`
		INSERT INTO encounters (
			patient_id, type, provider_id, vitals, clinical_notes, diagnosis_icd11, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, input.PatientID, input.Type, input.ProviderID, vitalsJSON, input.ClinicalNotes, input.DiagnosisICD11, status).Scan(&encounterID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create encounter: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "encounter_id": encounterID})
}

func createLabRequest(c *gin.Context) {
	var input struct {
		PatientID   string `json:"patient_id" binding:"required"`
		EncounterID string `json:"encounter_id"`
		TestType    string `json:"test_type" binding:"required"`
		OrderedBy   string `json:"ordered_by"`
		Priority    string `json:"priority"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		lr := LabRequest{
			ID:          fmt.Sprintf("uuid-lab-%d", len(inMemoryLabRequests)+1),
			PatientID:   input.PatientID,
			EncounterID: input.EncounterID,
			TestType:    input.TestType,
			OrderedBy:   input.OrderedBy,
			Priority:    input.Priority,
			Status:      "pending",
			CreatedAt:   time.Now(),
		}
		inMemoryLabRequests = append(inMemoryLabRequests, lr)
		c.JSON(http.StatusCreated, gin.H{"status": "success", "lab_request_id": lr.ID})
		return
	}

	priority := "normal"
	if input.Priority != "" {
		priority = input.Priority
	}

	var encID interface{} = nil
	if input.EncounterID != "" {
		encID = input.EncounterID
	}

	var labID string
	err := db.QueryRow(`
		INSERT INTO lab_requests (
			patient_id, encounter_id, test_type, ordered_by, priority, status
		) VALUES ($1, $2, $3, $4, $5, 'pending')
		RETURNING id
	`, input.PatientID, encID, input.TestType, input.OrderedBy, priority).Scan(&labID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lab request: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "lab_request_id": labID})
}

func completeLabRequest(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Result interface{} `json:"result"`
		Notes  string      `json:"notes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		for i, lr := range inMemoryLabRequests {
			if lr.ID == id {
				resJSON := "{}"
				if input.Result != nil {
					b, _ := json.Marshal(input.Result)
					resJSON = string(b)
				}
				inMemoryLabRequests[i].Status = "completed"
				inMemoryLabRequests[i].Result = resJSON
				inMemoryLabRequests[i].Notes = input.Notes
				c.JSON(http.StatusOK, gin.H{"status": "success"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Lab request not found"})
		return
	}

	resultJSON := "{}"
	if input.Result != nil {
		bytes, err := json.Marshal(input.Result)
		if err == nil {
			resultJSON = string(bytes)
		}
	}

	_, err := db.Exec(`
		UPDATE lab_requests 
		SET status = 'completed', result = $1, notes = $2, completed_at = CURRENT_TIMESTAMP
		WHERE id = $3
	`, resultJSON, input.Notes, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete lab request: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func createPrescription(c *gin.Context) {
	var input struct {
		PatientID          string `json:"patient_id" binding:"required"`
		EncounterID        string `json:"encounter_id"`
		DrugName           string `json:"drug_name"`
		DosageInstructions string `json:"dosage_instructions"`
		QuantityPrescribed int    `json:"quantity_prescribed"`
		PrescribedBy       string `json:"prescribed_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		pr := Prescription{
			ID:                 fmt.Sprintf("uuid-presc-%d", len(inMemoryPrescriptions)+1),
			PatientID:          input.PatientID,
			EncounterID:        input.EncounterID,
			DrugID:             input.DrugName,
			DosageInstructions: input.DosageInstructions,
			QuantityPrescribed: input.QuantityPrescribed,
			Status:             "pending",
			PrescribedBy:       input.PrescribedBy,
			CreatedAt:          time.Now(),
		}
		inMemoryPrescriptions = append(inMemoryPrescriptions, pr)
		c.JSON(http.StatusCreated, gin.H{"status": "success", "prescription_id": pr.ID})
		return
	}

	var encID interface{} = nil
	if input.EncounterID != "" {
		encID = input.EncounterID
	}

	var prescriptionID string
	err := db.QueryRow(`
		INSERT INTO prescriptions (
			patient_id, encounter_id, drug_id, dosage_instructions, quantity_prescribed, status, prescribed_by
		) VALUES ($1, $2, $3, $4, $5, 'pending', $6)
		RETURNING id
	`, input.PatientID, encID, input.DrugName, input.DosageInstructions, input.QuantityPrescribed, input.PrescribedBy).Scan(&prescriptionID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create prescription: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "prescription_id": prescriptionID})
}

func dispensePrescription(c *gin.Context) {
	id := c.Param("id")
	if isOfflineMode {
		for i, pr := range inMemoryPrescriptions {
			if pr.ID == id {
				inMemoryPrescriptions[i].Status = "dispensed"
				c.JSON(http.StatusOK, gin.H{"status": "success"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	_, err := db.Exec(`
		UPDATE prescriptions 
		SET status = 'dispensed', dispensed_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to dispense prescription: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

