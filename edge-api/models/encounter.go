package models

import (
	"time"
	"gorm.io/gorm"
)

type EncounterStatus string

const (
	StatusTriage      EncounterStatus = "TRIAGE"
	StatusConsult     EncounterStatus = "CONSULT"
	StatusLab         EncounterStatus = "LAB"
	StatusPharmacy    EncounterStatus = "PHARMACY"
	StatusCompleted   EncounterStatus = "COMPLETED"
	StatusAdmitted    EncounterStatus = "ADMITTED" // Sent to IPD
)

// Encounter represents a single visit by a patient.
type Encounter struct {
	ID              string          `gorm:"primaryKey;type:varchar(50)" json:"id"` // WatermelonDB UUID
	PatientID       string          `gorm:"type:varchar(50);index" json:"patient_id"`
	Patient         Patient         `gorm:"foreignKey:PatientID" json:"patient,omitempty"`
	AttendingUserID string          `gorm:"type:varchar(50);index" json:"attending_user_id"` // Who is handling them right now
	Status          EncounterStatus `gorm:"type:varchar(50);not null" json:"status"`
	ChiefComplaint  string          `gorm:"type:text" json:"chief_complaint"` // e.g. "Fever for 3 days"
	ICD11Code       string          `gorm:"type:varchar(20);index" json:"icd11_code"`
	ICD11Title      string          `gorm:"type:varchar(255)" json:"icd11_title"`
	IsEpidemicFlag  bool            `gorm:"default:false;index" json:"is_epidemic_flag"` // Triggers the Epidemic Radar
	TreatmentPlan   string          `gorm:"type:text" json:"treatment_plan"`  // Filled by CHO
	IsEmergency     bool            `gorm:"default:false" json:"is_emergency"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
	DeletedAt       gorm.DeletedAt  `gorm:"index" json:"-"`
}
