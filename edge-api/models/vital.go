package models

import (
	"time"
	"gorm.io/gorm"
)

// Vital represents a physiological measurement for a patient during an encounter.
type Vital struct {
	ID          string         `gorm:"primaryKey;type:varchar(50)" json:"id"` // WatermelonDB UUID
	EncounterID string         `gorm:"type:varchar(50);index" json:"encounter_id"`
	PatientID   string         `gorm:"type:varchar(50);index" json:"patient_id"`
	RecordedBy  string         `gorm:"type:varchar(50);index" json:"recorded_by"` // User ID (CHEW/Nurse)
	BloodPressure string       `gorm:"type:varchar(20)" json:"blood_pressure"` // e.g. 120/80
	Temperature   float64      `json:"temperature"` // in Celsius
	Weight        float64      `json:"weight"`      // in kg
	PulseRate     int          `json:"pulse_rate"`  // bpm
	RespiratoryRate int        `json:"respiratory_rate"` // breaths/min
	SpO2          int          `json:"spo2"` // percentage
	Notes       string         `gorm:"type:text" json:"notes"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
