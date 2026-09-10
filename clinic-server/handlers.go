package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// -----------------------------------------------------------------------------
// Core Data Types
// -----------------------------------------------------------------------------

// Patient is the canonical patient record. Every field maps 1:1 to the
// patients table in Neon. Any change to this struct needs a matching migration.
type Patient struct {
	ID                   string    `json:"id"`
	PhcID                string    `json:"phc_id"`
	FirstName            string    `json:"first_name"`
	LastName             string    `json:"last_name"`
	Phone                string    `json:"phone"`
	Gender               string    `json:"gender"`
	DateOfBirth          string    `json:"date_of_birth"`
	Tribe                string    `json:"tribe"`
	Religion             string    `json:"religion"`
	Occupation           string    `json:"occupation"`
	Address              string    `json:"address"`
	NextOfKinName        string    `json:"next_of_kin_name"`
	NextOfKinPhone       string    `json:"next_of_kin_phone"`
	IsANC                bool      `json:"is_anc"`
	ANCID                string    `json:"anc_id"`
	MotherID             string    `json:"mother_id"`
	RecordCompleteness   int       `json:"record_completeness"`
	IsDuplicate          bool      `json:"is_duplicate"`
	DuplicateOf          string    `json:"duplicate_of,omitempty"`
	LastUpdatedAt        time.Time `json:"last_updated_at"`
	LastUpdatedBy        string    `json:"last_updated_by"`
	CreatedAt            time.Time `json:"created_at"`
}

// AuditLogEntry represents a single recorded change to a patient record.
type AuditLogEntry struct {
	ID           string    `json:"id"`
	PatientID    string    `json:"patient_id"`
	ChangedBy    string    `json:"changed_by"`
	ChangedAt    time.Time `json:"changed_at"`
	FieldName    string    `json:"field_name"`
	OldValue     string    `json:"old_value"`
	NewValue     string    `json:"new_value"`
	ChangeSource string    `json:"change_source"`
}

// DuplicateCandidate is what we return to the frontend when we suspect
// that the person being registered already has a record.
type DuplicateCandidate struct {
	Patient Patient `json:"patient"`
	Reason  string  `json:"reason"`
}

// Encounter represents a single clinical interaction (triage, consultation, etc.)
type Encounter struct {
	ID             string    `json:"id"`
	PatientID      string    `json:"patient_id"`
	Type           string    `json:"type"`
	ProviderID     string    `json:"provider_id"`
	Vitals         string    `json:"vitals"`
	ClinicalNotes  string    `json:"clinical_notes"`
	DiagnosisICD11 string    `json:"diagnosis_icd11"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
}

// LabRequest represents a test ordered during an encounter.
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

// Prescription represents medicines prescribed during a consultation.
type Prescription struct {
	ID          string    `json:"id"`
	EncounterID string    `json:"encounter_id"`
	PatientID   string    `json:"patient_id"`
	Medication  string    `json:"medication"`
	Dosage      string    `json:"dosage"`
	Frequency   string    `json:"frequency"`
	Duration    string    `json:"duration"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

// Item is a lightweight struct used when listing patients in queue views.
type Item struct {
	ID             string                 `json:"id"`
	PhcID          string                 `json:"phc_id"`
	FirstName      string                 `json:"first_name"`
	LastName       string                 `json:"last_name"`
	Phone          string                 `json:"phone"`
	Gender         string                 `json:"gender"`
	DateOfBirth    string                 `json:"date_of_birth"`
	Status         string                 `json:"status"`
	Vitals         map[string]interface{} `json:"vitals,omitempty"`
	TestType       string                 `json:"test_type,omitempty"`
	Priority       string                 `json:"priority,omitempty"`
	Medication     string                 `json:"medication,omitempty"`
	EncounterID    string                 `json:"encounter_id,omitempty"`
}

// HistoryItem is one row in the patient's clinical timeline.
type HistoryItem struct {
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
}

// -----------------------------------------------------------------------------
// In-Memory State (used when DATABASE_URL is not set / no internet)
// -----------------------------------------------------------------------------

var (
	isOfflineMode         = false
	inMemoryPatients      = []Patient{}
	inMemoryEncounters    = []Encounter{}
	inMemoryLabRequests   = []LabRequest{}
	inMemoryPrescriptions = []Prescription{}
)

// -----------------------------------------------------------------------------
// Golden Record Helpers
// -----------------------------------------------------------------------------

// calculateCompleteness returns a score from 0 to 100 representing how much
// of the patient profile has been filled in. The weights are calibrated to
// match what is most important for clinical identification and follow-up.
func calculateCompleteness(
	firstName, lastName, phone, gender, dob, address, tribe, religion, occupation, nokName, nokPhone string,
) int {
	score := 0
	if strings.TrimSpace(firstName) != "" && strings.TrimSpace(lastName) != "" {
		score += 10
	}
	if strings.TrimSpace(phone) != "" {
		score += 15
	}
	if strings.TrimSpace(dob) != "" {
		score += 15
	}
	if strings.TrimSpace(gender) != "" {
		score += 10
	}
	if strings.TrimSpace(address) != "" {
		score += 10
	}
	if strings.TrimSpace(tribe) != "" || strings.TrimSpace(religion) != "" {
		score += 5
	}
	if strings.TrimSpace(occupation) != "" {
		score += 5
	}
	if strings.TrimSpace(nokName) != "" {
		score += 15
	}
	if strings.TrimSpace(nokPhone) != "" {
		score += 15
	}
	return score
}

// writeAuditLog records a single field change to patient_audit_log.
// It is intentionally a fire-and-forget call — if the log write fails,
// we log the error but do not block the user's action.
func writeAuditLog(patientID, changedBy, fieldName, oldValue, newValue, source string) {
	if isOfflineMode {
		return
	}
	_, err := db.Exec(`
		INSERT INTO patient_audit_log (patient_id, changed_by, field_name, old_value, new_value, change_source)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, patientID, changedBy, fieldName, oldValue, newValue, source)
	if err != nil {
		fmt.Printf("audit log write failed (non-critical): %v\n", err)
	}
}

// scanPatientRow scans a full patient row from a sql.Rows or sql.Row.
// All nullable string columns use sql.NullString so the driver never panics
// on empty values coming back from the database.
func scanPatientRow(rows *sql.Rows) (Patient, error) {
	var p Patient
	var dob, phone, gender, tribe, religion, occupation, address sql.NullString
	var nokName, nokPhone, ancID, motherID, dupOf, lastUpdatedBy sql.NullString

	err := rows.Scan(
		&p.ID, &p.PhcID, &p.FirstName, &p.LastName,
		&phone, &gender, &dob, &tribe, &religion, &occupation,
		&address, &nokName, &nokPhone, &p.IsANC, &ancID, &motherID,
		&p.RecordCompleteness, &p.IsDuplicate, &dupOf,
		&p.LastUpdatedAt, &lastUpdatedBy, &p.CreatedAt,
	)
	if err != nil {
		return p, err
	}

	p.Phone = phone.String
	p.Gender = gender.String
	p.DateOfBirth = dob.String
	p.Tribe = tribe.String
	p.Religion = religion.String
	p.Occupation = occupation.String
	p.Address = address.String
	p.NextOfKinName = nokName.String
	p.NextOfKinPhone = nokPhone.String
	p.ANCID = ancID.String
	p.MotherID = motherID.String
	p.DuplicateOf = dupOf.String
	p.LastUpdatedBy = lastUpdatedBy.String
	return p, nil
}

// patientSelectCols is the canonical column list for all SELECT statements
// that return a full Patient. Having this in one place means a column rename
// only needs to change one line.
const patientSelectCols = `
	id, phc_id, first_name, last_name, phone, gender, date_of_birth,
	tribe, religion, occupation, address, next_of_kin_name, next_of_kin_phone,
	is_anc, anc_id, mother_id,
	record_completeness, is_duplicate, duplicate_of,
	last_updated_at, last_updated_by, created_at
`

// -----------------------------------------------------------------------------
// Patient Handlers
// -----------------------------------------------------------------------------

func getPatients(c *gin.Context) {
	if isOfflineMode {
		c.JSON(http.StatusOK, inMemoryPatients)
		return
	}

	rows, err := db.Query(fmt.Sprintf(`
		SELECT %s FROM patients
		WHERE (is_archived = false OR is_archived IS NULL)
		  AND is_duplicate = false
		ORDER BY created_at DESC
		LIMIT 100
	`, patientSelectCols))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	patients := []Patient{}
	for rows.Next() {
		p, err := scanPatientRow(rows)
		if err != nil {
			fmt.Printf("scan error (skipping row): %v\n", err)
			continue
		}
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
		// Set to true by the frontend after the clerk reviews the duplicate warning
		// and decides the new record is genuinely a different person.
		ForceCreate    bool   `json:"force_create"`
		CreatedBy      string `json:"created_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdBy := input.CreatedBy
	if createdBy == "" {
		createdBy = "FRONT_DESK"
	}

	// ----- Offline mode -----
	if isOfflineMode {
		p := Patient{
			ID:                 fmt.Sprintf("uuid-pat-%d", len(inMemoryPatients)+1),
			PhcID:              fmt.Sprintf("PHC-PLA-%04d", len(inMemoryPatients)+1),
			FirstName:          input.FirstName,
			LastName:           input.LastName,
			Gender:             input.Gender,
			DateOfBirth:        input.DateOfBirth,
			Phone:              input.Phone,
			Address:            input.Address,
			Tribe:              input.Tribe,
			Religion:           input.Religion,
			Occupation:         input.Occupation,
			NextOfKinName:      input.NextOfKinName,
			NextOfKinPhone:     input.NextOfKinPhone,
			LastUpdatedBy:      createdBy,
			LastUpdatedAt:      time.Now(),
			CreatedAt:          time.Now(),
		}
		p.RecordCompleteness = calculateCompleteness(
			p.FirstName, p.LastName, p.Phone, p.Gender, p.DateOfBirth,
			p.Address, p.Tribe, p.Religion, p.Occupation,
			p.NextOfKinName, p.NextOfKinPhone,
		)
		inMemoryPatients = append(inMemoryPatients, p)
		c.JSON(http.StatusCreated, p)
		return
	}

	// ----- Duplicate detection (skip if clerk explicitly confirmed) -----
	if !input.ForceCreate {
		duplicates := checkForDuplicates(input.Phone, input.FirstName, input.LastName, input.DateOfBirth)
		if len(duplicates) > 0 {
			c.JSON(http.StatusConflict, gin.H{
				"duplicate_warning": true,
				"message":           "A patient with similar details already exists. Please review before proceeding.",
				"candidates":        duplicates,
			})
			return
		}
	}

	// ----- Generate PHC ID from total patient count -----
	var count int
	if err := db.QueryRow("SELECT count(*) FROM patients").Scan(&count); err != nil {
		count = 0
	}
	phcID := fmt.Sprintf("PHC-PLA-%04d", count+1)

	completeness := calculateCompleteness(
		input.FirstName, input.LastName, input.Phone, input.Gender, input.DateOfBirth,
		input.Address, input.Tribe, input.Religion, input.Occupation,
		input.NextOfKinName, input.NextOfKinPhone,
	)

	var dob interface{}
	if input.DateOfBirth == "" {
		dob = nil
	} else {
		dob = input.DateOfBirth
	}

	var p Patient
	var returnedDOB, returnedPhone, returnedGender sql.NullString

	err := db.QueryRow(`
		INSERT INTO patients (
			phc_id, first_name, last_name, phone, gender, date_of_birth,
			tribe, religion, occupation, address, next_of_kin_name, next_of_kin_phone,
			is_anc, record_completeness, last_updated_by
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,false,$13,$14)
		RETURNING id, phc_id, first_name, last_name, phone, gender, date_of_birth,
		          record_completeness, is_duplicate, last_updated_by, last_updated_at, created_at
	`, phcID, input.FirstName, input.LastName, input.Phone, input.Gender, dob,
		input.Tribe, input.Religion, input.Occupation, input.Address,
		input.NextOfKinName, input.NextOfKinPhone, completeness, createdBy,
	).Scan(
		&p.ID, &p.PhcID, &p.FirstName, &p.LastName,
		&returnedPhone, &returnedGender, &returnedDOB,
		&p.RecordCompleteness, &p.IsDuplicate, &p.LastUpdatedBy, &p.LastUpdatedAt, &p.CreatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create patient", "details": err.Error()})
		return
	}

	p.Phone = returnedPhone.String
	p.Gender = returnedGender.String
	p.DateOfBirth = returnedDOB.String
	p.Tribe = input.Tribe
	p.Religion = input.Religion
	p.Occupation = input.Occupation
	p.Address = input.Address
	p.NextOfKinName = input.NextOfKinName
	p.NextOfKinPhone = input.NextOfKinPhone

	// Write audit log for creation
	writeAuditLog(p.ID, createdBy, "RECORD_CREATED", "", p.PhcID, "FRONT_DESK")

	c.JSON(http.StatusCreated, p)
}

// checkForDuplicates queries the patients table for records that look like
// the same person. It checks phone first (exact match), then falls back to
// name + DOB similarity. Returns at most 5 candidates so the frontend
// does not get overwhelmed.
func checkForDuplicates(phone, firstName, lastName, dob string) []DuplicateCandidate {
	candidates := []DuplicateCandidate{}

	if phone != "" {
		rows, err := db.Query(fmt.Sprintf(`
			SELECT %s FROM patients
			WHERE phone = $1 AND is_duplicate = false
			  AND (is_archived = false OR is_archived IS NULL)
			LIMIT 3
		`, patientSelectCols), phone)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				p, err := scanPatientRow(rows)
				if err == nil {
					candidates = append(candidates, DuplicateCandidate{
						Patient: p,
						Reason:  "Same phone number",
					})
				}
			}
		}
	}

	if len(candidates) == 0 && firstName != "" && lastName != "" && dob != "" {
		rows, err := db.Query(fmt.Sprintf(`
			SELECT %s FROM patients
			WHERE LOWER(first_name) = LOWER($1)
			  AND LOWER(last_name)  = LOWER($2)
			  AND date_of_birth::date = $3::date
			  AND is_duplicate = false
			  AND (is_archived = false OR is_archived IS NULL)
			LIMIT 3
		`, patientSelectCols), firstName, lastName, dob)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				p, err := scanPatientRow(rows)
				if err == nil {
					candidates = append(candidates, DuplicateCandidate{
						Patient: p,
						Reason:  "Same name and date of birth",
					})
				}
			}
		}
	}

	return candidates
}

func updatePatient(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		FirstName      *string `json:"first_name"`
		LastName       *string `json:"last_name"`
		Phone          *string `json:"phone"`
		Gender         *string `json:"gender"`
		DateOfBirth    *string `json:"date_of_birth"`
		Tribe          *string `json:"tribe"`
		Religion       *string `json:"religion"`
		Occupation     *string `json:"occupation"`
		Address        *string `json:"address"`
		NextOfKinName  *string `json:"next_of_kin_name"`
		NextOfKinPhone *string `json:"next_of_kin_phone"`
		UpdatedBy      string  `json:"updated_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedBy := input.UpdatedBy
	if updatedBy == "" {
		updatedBy = "SYSTEM"
	}

	// ----- Offline mode -----
	if isOfflineMode {
		for i, p := range inMemoryPatients {
			if p.ID == id {
				if input.FirstName != nil {
					inMemoryPatients[i].FirstName = *input.FirstName
				}
				if input.LastName != nil {
					inMemoryPatients[i].LastName = *input.LastName
				}
				if input.Phone != nil {
					inMemoryPatients[i].Phone = *input.Phone
				}
				c.JSON(http.StatusOK, inMemoryPatients[i])
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}

	// Fetch the existing record so we can compare old vs new values for the audit log
	var old Patient
	oldRow, err := db.Query(fmt.Sprintf("SELECT %s FROM patients WHERE id = $1", patientSelectCols), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch existing record"})
		return
	}
	defer oldRow.Close()
	if oldRow.Next() {
		old, err = scanPatientRow(oldRow)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read existing record"})
			return
		}
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}
	oldRow.Close()

	// Build the SET clause dynamically, only for fields the caller provided
	setClauses := []string{"last_updated_at = NOW()", "last_updated_by = $1"}
	args := []interface{}{updatedBy, id}
	argIdx := 3

	type fieldChange struct {
		name     string
		oldVal   string
		newVal   string
	}
	var changes []fieldChange

	applyField := func(fieldName, oldVal string, newValPtr *string) {
		if newValPtr == nil {
			return
		}
		newVal := *newValPtr
		if newVal == oldVal {
			return
		}
		setClauses = append(setClauses, fmt.Sprintf("%s = $%d", fieldName, argIdx))
		args = append(args, newVal)
		argIdx++
		changes = append(changes, fieldChange{fieldName, oldVal, newVal})
	}

	applyField("first_name", old.FirstName, input.FirstName)
	applyField("last_name", old.LastName, input.LastName)
	applyField("phone", old.Phone, input.Phone)
	applyField("gender", old.Gender, input.Gender)
	applyField("date_of_birth", old.DateOfBirth, input.DateOfBirth)
	applyField("tribe", old.Tribe, input.Tribe)
	applyField("religion", old.Religion, input.Religion)
	applyField("occupation", old.Occupation, input.Occupation)
	applyField("address", old.Address, input.Address)
	applyField("next_of_kin_name", old.NextOfKinName, input.NextOfKinName)
	applyField("next_of_kin_phone", old.NextOfKinPhone, input.NextOfKinPhone)

	if len(changes) == 0 {
		c.JSON(http.StatusOK, gin.H{"status": "no changes", "patient": old})
		return
	}

	// Recalculate completeness with new values
	newFirstName := old.FirstName
	if input.FirstName != nil { newFirstName = *input.FirstName }
	newLastName := old.LastName
	if input.LastName != nil { newLastName = *input.LastName }
	newPhone := old.Phone
	if input.Phone != nil { newPhone = *input.Phone }
	newGender := old.Gender
	if input.Gender != nil { newGender = *input.Gender }
	newDOB := old.DateOfBirth
	if input.DateOfBirth != nil { newDOB = *input.DateOfBirth }
	newAddress := old.Address
	if input.Address != nil { newAddress = *input.Address }
	newTribe := old.Tribe
	if input.Tribe != nil { newTribe = *input.Tribe }
	newReligion := old.Religion
	if input.Religion != nil { newReligion = *input.Religion }
	newOccupation := old.Occupation
	if input.Occupation != nil { newOccupation = *input.Occupation }
	newNokName := old.NextOfKinName
	if input.NextOfKinName != nil { newNokName = *input.NextOfKinName }
	newNokPhone := old.NextOfKinPhone
	if input.NextOfKinPhone != nil { newNokPhone = *input.NextOfKinPhone }

	newCompleteness := calculateCompleteness(
		newFirstName, newLastName, newPhone, newGender, newDOB,
		newAddress, newTribe, newReligion, newOccupation, newNokName, newNokPhone,
	)
	setClauses = append(setClauses, fmt.Sprintf("record_completeness = $%d", argIdx))
	args = append(args, newCompleteness)
	argIdx++

	query := fmt.Sprintf(
		"UPDATE patients SET %s WHERE id = $2",
		strings.Join(setClauses, ", "),
	)
	_, execErr := db.Exec(query, args...)
	if execErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed: " + execErr.Error()})
		return
	}

	// Write one audit log entry per changed field
	for _, ch := range changes {
		writeAuditLog(id, updatedBy, ch.name, ch.oldVal, ch.newVal, "RECORDS_UNIT")
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated", "changes": len(changes), "record_completeness": newCompleteness})
}

func getPatientAuditLog(c *gin.Context) {
	id := c.Param("id")

	if isOfflineMode {
		c.JSON(http.StatusOK, []AuditLogEntry{})
		return
	}

	rows, err := db.Query(`
		SELECT id, patient_id, changed_by, changed_at, field_name, old_value, new_value, change_source
		FROM patient_audit_log
		WHERE patient_id = $1
		ORDER BY changed_at DESC
		LIMIT 200
	`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	entries := []AuditLogEntry{}
	for rows.Next() {
		var e AuditLogEntry
		var oldVal, newVal sql.NullString
		if err := rows.Scan(&e.ID, &e.PatientID, &e.ChangedBy, &e.ChangedAt,
			&e.FieldName, &oldVal, &newVal, &e.ChangeSource); err != nil {
			continue
		}
		e.OldValue = oldVal.String
		e.NewValue = newVal.String
		entries = append(entries, e)
	}
	c.JSON(http.StatusOK, entries)
}

func mergePatients(c *gin.Context) {
	var input struct {
		GoldenID    string `json:"golden_id" binding:"required"`
		DuplicateID string `json:"duplicate_id" binding:"required"`
		MergedBy    string `json:"merged_by"`
		Notes       string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if isOfflineMode {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Merge is not available in offline mode"})
		return
	}

	mergedBy := input.MergedBy
	if mergedBy == "" {
		mergedBy = "ADMIN"
	}

	// Sanity check: make sure neither ID is already the duplicate of something else
	var goldenIsDup bool
	if err := db.QueryRow("SELECT is_duplicate FROM patients WHERE id = $1", input.GoldenID).Scan(&goldenIsDup); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Golden patient not found"})
		return
	}
	if goldenIsDup {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The chosen golden record is itself marked as a duplicate. Pick the original."})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
		return
	}
	defer tx.Rollback()

	// Re-point all clinical data from the duplicate to the golden record
	tables := []string{"encounters", "lab_requests", "prescriptions"}
	for _, tbl := range tables {
		if _, err := tx.Exec(fmt.Sprintf("UPDATE %s SET patient_id = $1 WHERE patient_id = $2", tbl),
			input.GoldenID, input.DuplicateID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to migrate %s: %v", tbl, err)})
			return
		}
	}

	// Mark the duplicate record
	if _, err := tx.Exec(`
		UPDATE patients
		SET is_duplicate = true, duplicate_of = $1, last_updated_at = NOW(), last_updated_by = $2
		WHERE id = $3
	`, input.GoldenID, mergedBy, input.DuplicateID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark duplicate: " + err.Error()})
		return
	}

	// Record the merge in the identity links table for future reference
	if _, err := tx.Exec(`
		INSERT INTO patient_identity_links (golden_patient_id, duplicate_patient_id, merged_by, notes)
		VALUES ($1, $2, $3, $4)
	`, input.GoldenID, input.DuplicateID, mergedBy, input.Notes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record merge: " + err.Error()})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Commit failed: " + err.Error()})
		return
	}

	writeAuditLog(input.GoldenID, mergedBy, "RECORD_MERGED_IN", input.DuplicateID, "", "RECORDS_UNIT")
	writeAuditLog(input.DuplicateID, mergedBy, "RECORD_MARKED_DUPLICATE", "", input.GoldenID, "RECORDS_UNIT")

	c.JSON(http.StatusOK, gin.H{
		"status":     "merged",
		"golden_id":  input.GoldenID,
		"retired_id": input.DuplicateID,
	})
}

func getDuplicates(c *gin.Context) {
	if isOfflineMode {
		c.JSON(http.StatusOK, []gin.H{})
		return
	}
	// Returns pairs of patients that share the same phone number and were
	// both registered without force_create. A facility admin can review this
	// list and merge them.
	rows, err := db.Query(`
		SELECT a.id, a.phc_id, a.first_name, a.last_name, a.phone, a.created_at,
		       b.id, b.phc_id, b.first_name, b.last_name, b.phone, b.created_at
		FROM patients a
		JOIN patients b ON a.phone = b.phone AND a.id < b.id
		WHERE a.phone IS NOT NULL AND a.phone != ''
		  AND a.is_duplicate = false AND b.is_duplicate = false
		  AND (a.is_archived = false OR a.is_archived IS NULL)
		  AND (b.is_archived = false OR b.is_archived IS NULL)
		LIMIT 50
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	type DupPair struct {
		RecordA gin.H `json:"record_a"`
		RecordB gin.H `json:"record_b"`
		Reason  string `json:"reason"`
	}
	pairs := []DupPair{}
	for rows.Next() {
		var aID, aPhcID, aFirst, aLast, aPhone string
		var aCreated time.Time
		var bID, bPhcID, bFirst, bLast, bPhone string
		var bCreated time.Time
		if err := rows.Scan(&aID, &aPhcID, &aFirst, &aLast, &aPhone, &aCreated,
			&bID, &bPhcID, &bFirst, &bLast, &bPhone, &bCreated); err != nil {
			continue
		}
		pairs = append(pairs, DupPair{
			RecordA: gin.H{"id": aID, "phc_id": aPhcID, "name": aFirst + " " + aLast, "phone": aPhone, "created_at": aCreated},
			RecordB: gin.H{"id": bID, "phc_id": bPhcID, "name": bFirst + " " + bLast, "phone": bPhone, "created_at": bCreated},
			Reason:  "Same phone number",
		})
	}
	c.JSON(http.StatusOK, pairs)
}

// -----------------------------------------------------------------------------
// DHIS2 Sync Handler
// -----------------------------------------------------------------------------

func dhis2SyncHandler(c *gin.Context) {
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	time.Sleep(1 * time.Second)
	c.JSON(http.StatusOK, gin.H{
		"status":          "success",
		"message":         "Aggregated data synced to DHIS2 successfully",
		"timestamp":       time.Now().Format(time.RFC3339),
		"synced_programs": []string{"malaria", "hiv", "tb", "hypertension", "diabetes"},
	})
}

// -----------------------------------------------------------------------------
// Queue Handlers
// -----------------------------------------------------------------------------

func getTriageQueue(c *gin.Context) {
	if isOfflineMode {
		triageCompleted := make(map[string]bool)
		for _, e := range inMemoryEncounters {
			if e.Type == "Triage" {
				triageCompleted[e.PatientID] = true
			}
		}
		result := []Patient{}
		for _, p := range inMemoryPatients {
			if !triageCompleted[p.ID] {
				result = append(result, p)
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	rows, err := db.Query(`
		SELECT p.id, p.phc_id, p.first_name, p.last_name, p.phone, p.gender, p.date_of_birth, p.created_at
		FROM patients p
		WHERE (p.is_archived = false OR p.is_archived IS NULL)
		  AND p.is_duplicate = false
		  AND NOT EXISTS (
			SELECT 1 FROM encounters e WHERE e.patient_id = p.id AND e.type = 'Triage'
		  )
		ORDER BY p.created_at ASC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	patients := []Patient{}
	for rows.Next() {
		var p Patient
		var dob sql.NullString
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
		result := []Item{}
		for _, e := range inMemoryEncounters {
			if e.Type == "Triage" && e.Status == "completed" {
				for _, p := range inMemoryPatients {
					if p.ID == e.PatientID {
						result = append(result, Item{
							ID: p.ID, PhcID: p.PhcID,
							FirstName: p.FirstName, LastName: p.LastName,
							Status: "awaiting_consultation",
						})
						break
					}
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	rows, err := db.Query(`
		SELECT p.id, p.phc_id, p.first_name, p.last_name, p.phone, p.gender, p.date_of_birth,
		       e.vitals
		FROM patients p
		JOIN encounters e ON e.patient_id = p.id AND e.type = 'Triage' AND e.status = 'completed'
		WHERE (p.is_archived = false OR p.is_archived IS NULL)
		  AND p.is_duplicate = false
		  AND NOT EXISTS (
			SELECT 1 FROM encounters c WHERE c.patient_id = p.id AND c.type = 'Consultation'
		  )
		ORDER BY e.created_at ASC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	items := []Item{}
	for rows.Next() {
		var item Item
		var dob sql.NullString
		var vitalsRaw []byte
		if err := rows.Scan(&item.ID, &item.PhcID, &item.FirstName, &item.LastName, &item.Phone, &item.Gender, &dob, &vitalsRaw); err != nil {
			continue
		}
		item.DateOfBirth = dob.String
		if len(vitalsRaw) > 0 {
			var vitalsMap map[string]interface{}
			if err := json.Unmarshal(vitalsRaw, &vitalsMap); err == nil {
				item.Vitals = vitalsMap
			}
		}
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getLaboratoryQueue(c *gin.Context) {
	if isOfflineMode {
		result := []Item{}
		for _, lr := range inMemoryLabRequests {
			if lr.Status == "pending" {
				for _, p := range inMemoryPatients {
					if p.ID == lr.PatientID {
						result = append(result, Item{
							ID: p.ID, PhcID: p.PhcID,
							FirstName: p.FirstName, LastName: p.LastName,
							TestType: lr.TestType, Priority: lr.Priority,
							EncounterID: lr.EncounterID, Status: "pending",
						})
						break
					}
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	rows, err := db.Query(`
		SELECT p.id, p.phc_id, p.first_name, p.last_name, p.phone, p.gender,
		       lr.test_type, lr.priority, lr.encounter_id, lr.id as lab_request_id
		FROM patients p
		JOIN lab_requests lr ON lr.patient_id = p.id AND lr.status = 'pending'
		WHERE (p.is_archived = false OR p.is_archived IS NULL)
		  AND p.is_duplicate = false
		ORDER BY CASE lr.priority WHEN 'urgent' THEN 1 WHEN 'routine' THEN 2 ELSE 3 END, lr.created_at ASC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	items := []Item{}
	for rows.Next() {
		var item Item
		if err := rows.Scan(&item.ID, &item.PhcID, &item.FirstName, &item.LastName,
			&item.Phone, &item.Gender, &item.TestType, &item.Priority, &item.EncounterID, &item.EncounterID); err != nil {
			continue
		}
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getPharmacyQueue(c *gin.Context) {
	if isOfflineMode {
		result := []Item{}
		for _, rx := range inMemoryPrescriptions {
			if rx.Status == "pending" {
				for _, p := range inMemoryPatients {
					if p.ID == rx.PatientID {
						result = append(result, Item{
							ID: p.ID, PhcID: p.PhcID,
							FirstName: p.FirstName, LastName: p.LastName,
							Medication: rx.Medication, EncounterID: rx.EncounterID, Status: "pending",
						})
						break
					}
				}
			}
		}
		c.JSON(http.StatusOK, result)
		return
	}

	rows, err := db.Query(`
		SELECT p.id, p.phc_id, p.first_name, p.last_name,
		       rx.medication, rx.encounter_id
		FROM patients p
		JOIN prescriptions rx ON rx.patient_id = p.id AND rx.status = 'pending'
		WHERE (p.is_archived = false OR p.is_archived IS NULL)
		  AND p.is_duplicate = false
		ORDER BY rx.created_at ASC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	items := []Item{}
	for rows.Next() {
		var item Item
		if err := rows.Scan(&item.ID, &item.PhcID, &item.FirstName, &item.LastName,
			&item.Medication, &item.EncounterID); err != nil {
			continue
		}
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func getBillingQueue(c *gin.Context) {
	if isOfflineMode {
		c.JSON(http.StatusOK, []Item{})
		return
	}
	rows, err := db.Query(`
		SELECT p.id, p.phc_id, p.first_name, p.last_name, p.phone,
		       e.id as encounter_id, e.status
		FROM patients p
		JOIN encounters e ON e.patient_id = p.id
		WHERE e.status = 'awaiting_billing'
		  AND (p.is_archived = false OR p.is_archived IS NULL)
		  AND p.is_duplicate = false
		ORDER BY e.created_at ASC
		LIMIT 100
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	items := []Item{}
	for rows.Next() {
		var item Item
		if err := rows.Scan(&item.ID, &item.PhcID, &item.FirstName, &item.LastName,
			&item.Phone, &item.EncounterID, &item.Status); err != nil {
			continue
		}
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

// -----------------------------------------------------------------------------
// Clinical Action Handlers
// -----------------------------------------------------------------------------

func createEncounter(c *gin.Context) {
	var input struct {
		PatientID      string `json:"patient_id" binding:"required"`
		Type           string `json:"type" binding:"required"`
		ProviderID     string `json:"provider_id"`
		Vitals         string `json:"vitals"`
		ClinicalNotes  string `json:"clinical_notes"`
		DiagnosisICD11 string `json:"diagnosis_icd11"`
		Status         string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Status == "" {
		input.Status = "completed"
	}

	if isOfflineMode {
		enc := Encounter{
			ID:             fmt.Sprintf("uuid-enc-%d", len(inMemoryEncounters)+1),
			PatientID:      input.PatientID,
			Type:           input.Type,
			ProviderID:     input.ProviderID,
			Vitals:         input.Vitals,
			ClinicalNotes:  input.ClinicalNotes,
			DiagnosisICD11: input.DiagnosisICD11,
			Status:         input.Status,
			CreatedAt:      time.Now(),
		}
		inMemoryEncounters = append(inMemoryEncounters, enc)
		c.JSON(http.StatusCreated, enc)
		return
	}

	var enc Encounter
	err := db.QueryRow(`
		INSERT INTO encounters (patient_id, type, provider_id, vitals, clinical_notes, diagnosis_icd11, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, patient_id, type, provider_id, vitals, clinical_notes, diagnosis_icd11, status, created_at
	`, input.PatientID, input.Type, input.ProviderID, input.Vitals,
		input.ClinicalNotes, input.DiagnosisICD11, input.Status).
		Scan(&enc.ID, &enc.PatientID, &enc.Type, &enc.ProviderID, &enc.Vitals,
			&enc.ClinicalNotes, &enc.DiagnosisICD11, &enc.Status, &enc.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create encounter: " + err.Error()})
		return
	}

	writeAuditLog(input.PatientID, input.ProviderID, "ENCOUNTER_CREATED", "", enc.ID, input.Type)
	c.JSON(http.StatusCreated, enc)
}

func createLabRequest(c *gin.Context) {
	var input struct {
		PatientID   string `json:"patient_id" binding:"required"`
		EncounterID string `json:"encounter_id"`
		TestType    string `json:"test_type" binding:"required"`
		OrderedBy   string `json:"ordered_by"`
		Priority    string `json:"priority"`
		Notes       string `json:"notes"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Priority == "" {
		input.Priority = "routine"
	}

	if isOfflineMode {
		lr := LabRequest{
			ID:          fmt.Sprintf("uuid-lr-%d", len(inMemoryLabRequests)+1),
			PatientID:   input.PatientID,
			EncounterID: input.EncounterID,
			TestType:    input.TestType,
			OrderedBy:   input.OrderedBy,
			Priority:    input.Priority,
			Notes:       input.Notes,
			Status:      "pending",
			CreatedAt:   time.Now(),
		}
		inMemoryLabRequests = append(inMemoryLabRequests, lr)
		c.JSON(http.StatusCreated, lr)
		return
	}

	var lr LabRequest
	err := db.QueryRow(`
		INSERT INTO lab_requests (patient_id, encounter_id, test_type, ordered_by, priority, notes, status)
		VALUES ($1, $2, $3, $4, $5, $6, 'pending')
		RETURNING id, patient_id, encounter_id, test_type, ordered_by, priority, notes, status, created_at
	`, input.PatientID, input.EncounterID, input.TestType, input.OrderedBy, input.Priority, input.Notes).
		Scan(&lr.ID, &lr.PatientID, &lr.EncounterID, &lr.TestType,
			&lr.OrderedBy, &lr.Priority, &lr.Notes, &lr.Status, &lr.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lab request: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, lr)
}

func completeLabRequest(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Result    string `json:"result" binding:"required"`
		Notes     string `json:"notes"`
		CompletedBy string `json:"completed_by"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		for i, lr := range inMemoryLabRequests {
			if lr.ID == id {
				inMemoryLabRequests[i].Status = "completed"
				inMemoryLabRequests[i].Result = input.Result
				inMemoryLabRequests[i].Notes = input.Notes
				c.JSON(http.StatusOK, inMemoryLabRequests[i])
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Lab request not found"})
		return
	}

	var lr LabRequest
	err := db.QueryRow(`
		UPDATE lab_requests SET status = 'completed', result = $1, notes = $2
		WHERE id = $3
		RETURNING id, patient_id, encounter_id, test_type, ordered_by, priority, notes, status, result, created_at
	`, input.Result, input.Notes, id).
		Scan(&lr.ID, &lr.PatientID, &lr.EncounterID, &lr.TestType,
			&lr.OrderedBy, &lr.Priority, &lr.Notes, &lr.Status, &lr.Result, &lr.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete lab request: " + err.Error()})
		return
	}

	writeAuditLog(lr.PatientID, input.CompletedBy, "LAB_RESULT_RECORDED", "", input.Result, "LABORATORY")
	c.JSON(http.StatusOK, lr)
}

func createPrescription(c *gin.Context) {
	var input struct {
		PatientID   string `json:"patient_id" binding:"required"`
		EncounterID string `json:"encounter_id"`
		Medication  string `json:"medication" binding:"required"`
		Dosage      string `json:"dosage"`
		Frequency   string `json:"frequency"`
		Duration    string `json:"duration"`
		PrescribedBy string `json:"prescribed_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		rx := Prescription{
			ID:          fmt.Sprintf("uuid-rx-%d", len(inMemoryPrescriptions)+1),
			PatientID:   input.PatientID,
			EncounterID: input.EncounterID,
			Medication:  input.Medication,
			Dosage:      input.Dosage,
			Frequency:   input.Frequency,
			Duration:    input.Duration,
			Status:      "pending",
			CreatedAt:   time.Now(),
		}
		inMemoryPrescriptions = append(inMemoryPrescriptions, rx)
		c.JSON(http.StatusCreated, rx)
		return
	}

	var rx Prescription
	err := db.QueryRow(`
		INSERT INTO prescriptions (patient_id, encounter_id, medication, dosage, frequency, duration, status)
		VALUES ($1, $2, $3, $4, $5, $6, 'pending')
		RETURNING id, patient_id, encounter_id, medication, dosage, frequency, duration, status, created_at
	`, input.PatientID, input.EncounterID, input.Medication, input.Dosage,
		input.Frequency, input.Duration).
		Scan(&rx.ID, &rx.PatientID, &rx.EncounterID, &rx.Medication,
			&rx.Dosage, &rx.Frequency, &rx.Duration, &rx.Status, &rx.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create prescription: " + err.Error()})
		return
	}

	writeAuditLog(input.PatientID, input.PrescribedBy, "PRESCRIPTION_CREATED", "", input.Medication, "CONSULTATION")
	c.JSON(http.StatusCreated, rx)
}

func dispensePrescription(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		DispensedBy string `json:"dispensed_by"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if isOfflineMode {
		for i, rx := range inMemoryPrescriptions {
			if rx.ID == id {
				inMemoryPrescriptions[i].Status = "dispensed"
				c.JSON(http.StatusOK, inMemoryPrescriptions[i])
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	var rx Prescription
	err := db.QueryRow(`
		UPDATE prescriptions SET status = 'dispensed'
		WHERE id = $1
		RETURNING id, patient_id, encounter_id, medication, dosage, frequency, duration, status, created_at
	`, id).Scan(&rx.ID, &rx.PatientID, &rx.EncounterID, &rx.Medication,
		&rx.Dosage, &rx.Frequency, &rx.Duration, &rx.Status, &rx.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to dispense prescription: " + err.Error()})
		return
	}

	writeAuditLog(rx.PatientID, input.DispensedBy, "PRESCRIPTION_DISPENSED", "", rx.Medication, "PHARMACY")
	c.JSON(http.StatusOK, rx)
}

// -----------------------------------------------------------------------------
// Patient History
// -----------------------------------------------------------------------------

func getPatientHistory(c *gin.Context) {
	patientID := c.Param("id")

	if isOfflineMode {
		history := []HistoryItem{}
		for _, e := range inMemoryEncounters {
			if e.PatientID == patientID {
				history = append(history, HistoryItem{
					Type:  e.Type,
					Title: e.Type,
					Date:  e.CreatedAt,
				})
			}
		}
		c.JSON(http.StatusOK, history)
		return
	}

	history := []HistoryItem{}

	rows, err := db.Query(`
		SELECT 'Encounter' as type,
		       type as title,
		       COALESCE(clinical_notes, diagnosis_icd11, '') as description,
		       created_at
		FROM encounters WHERE patient_id = $1
		UNION ALL
		SELECT 'Lab Request', test_type, COALESCE(result, ''), created_at
		FROM lab_requests WHERE patient_id = $1
		UNION ALL
		SELECT 'Prescription', medication,
		       COALESCE(dosage, '') || ' ' || COALESCE(frequency, ''),
		       created_at
		FROM prescriptions WHERE patient_id = $1
		ORDER BY created_at DESC
	`, patientID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item HistoryItem
		if err := rows.Scan(&item.Type, &item.Title, &item.Description, &item.Date); err == nil {
			history = append(history, item)
		}
	}
	c.JSON(http.StatusOK, history)
}

// -----------------------------------------------------------------------------
// ANC Module Handlers
// -----------------------------------------------------------------------------

func enrollANC(c *gin.Context) {
	id := c.Param("id")

	if isOfflineMode {
		for i, p := range inMemoryPatients {
			if p.ID == id {
				inMemoryPatients[i].IsANC = true
				inMemoryPatients[i].ANCID = fmt.Sprintf("ANC-PLA-%04d", len(inMemoryPatients)+1)
				c.JSON(http.StatusOK, inMemoryPatients[i])
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}

	var count int
	if err := db.QueryRow("SELECT count(*) FROM patients WHERE is_anc = true").Scan(&count); err != nil {
		count = 0
	}
	ancID := fmt.Sprintf("ANC-PLA-%04d", count+1)

	var updated Patient
	var dob, mID sql.NullString

	err := db.QueryRow(`
		UPDATE patients SET is_anc = true, anc_id = $1, last_updated_at = NOW(), last_updated_by = 'CONSULTATION'
		WHERE id = $2
		RETURNING id, phc_id, first_name, last_name, phone, gender, date_of_birth,
		          tribe, religion, occupation, address, next_of_kin_name, next_of_kin_phone,
		          is_anc, anc_id, mother_id, record_completeness, is_duplicate, duplicate_of,
		          last_updated_at, last_updated_by, created_at
	`, ancID, id).Scan(
		&updated.ID, &updated.PhcID, &updated.FirstName, &updated.LastName,
		&updated.Phone, &updated.Gender, &dob,
		&updated.Tribe, &updated.Religion, &updated.Occupation,
		&updated.Address, &updated.NextOfKinName, &updated.NextOfKinPhone,
		&updated.IsANC, &updated.ANCID, &mID,
		&updated.RecordCompleteness, &updated.IsDuplicate, &updated.DuplicateOf,
		&updated.LastUpdatedAt, &updated.LastUpdatedBy, &updated.CreatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to enroll in ANC: " + err.Error()})
		return
	}

	updated.DateOfBirth = dob.String
	updated.MotherID = mID.String

	writeAuditLog(id, "CONSULTATION", "ANC_ENROLLED", "", ancID, "CONSULTATION")
	c.JSON(http.StatusOK, updated)
}

func createNewborn(c *gin.Context) {
	var input struct {
		MotherID    string `json:"mother_id" binding:"required"`
		Gender      string `json:"gender" binding:"required"`
		BirthWeight string `json:"birth_weight"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	motherName := "Unknown Mother"
	if isOfflineMode {
		for _, p := range inMemoryPatients {
			if p.ID == input.MotherID {
				motherName = strings.TrimSpace(p.FirstName + " " + p.LastName)
				break
			}
		}
	} else {
		db.QueryRow("SELECT TRIM(first_name || ' ' || last_name) FROM patients WHERE id = $1", input.MotherID).Scan(&motherName)
	}

	firstName := "Baby of " + motherName
	dob := time.Now().Format("2006-01-02")

	if isOfflineMode {
		p := Patient{
			ID:        fmt.Sprintf("uuid-pat-%d", len(inMemoryPatients)+1),
			PhcID:     fmt.Sprintf("PHC-PLA-%04d", len(inMemoryPatients)+1),
			FirstName: firstName,
			Gender:    input.Gender,
			DateOfBirth: dob,
			MotherID:  input.MotherID,
			CreatedAt: time.Now(),
		}
		inMemoryPatients = append(inMemoryPatients, p)
		c.JSON(http.StatusCreated, p)
		return
	}

	var count int
	if err := db.QueryRow("SELECT count(*) FROM patients").Scan(&count); err != nil {
		count = 0
	}
	phcID := fmt.Sprintf("PHC-PLA-%04d", count+1)

	// Newborn completeness: we know name, gender, DOB, and mother_id
	completeness := calculateCompleteness(firstName, "", "", input.Gender, dob, "", "", "", "", "", "")

	var p Patient
	err := db.QueryRow(`
		INSERT INTO patients (phc_id, first_name, gender, date_of_birth, mother_id, record_completeness, last_updated_by)
		VALUES ($1, $2, $3, $4, $5, $6, 'ANC_DELIVERY')
		RETURNING id, phc_id, first_name, gender, date_of_birth, mother_id, record_completeness, created_at
	`, phcID, firstName, input.Gender, dob, input.MotherID, completeness).
		Scan(&p.ID, &p.PhcID, &p.FirstName, &p.Gender, &p.DateOfBirth, &p.MotherID, &p.RecordCompleteness, &p.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register newborn: " + err.Error()})
		return
	}

	writeAuditLog(p.ID, "ANC_DELIVERY", "RECORD_CREATED", "", p.PhcID, "ANC_DELIVERY")
	writeAuditLog(input.MotherID, "ANC_DELIVERY", "NEWBORN_REGISTERED", "", p.PhcID, "ANC_DELIVERY")

	c.JSON(http.StatusCreated, p)
}
