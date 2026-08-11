package models

import (
	"time"
	"gorm.io/gorm"
)

type Role string

const (
	RoleRecordsOfficer Role = "RECORDS_OFFICER"
	RoleCHEW           Role = "CHEW"
	RoleCHO            Role = "CHO" // Community Health Officer
	RoleAdmin          Role = "ADMIN"
)

// User represents a staff member at the clinic.
type User struct {
	ID           string         `gorm:"type:uuid;primary_key;" json:"id"` // Offline-safe UUID
	Name         string         `gorm:"type:varchar(100);not null" json:"name"`
	Role         Role           `gorm:"type:varchar(50);not null" json:"role"`
	Phone        string         `gorm:"type:varchar(20);uniqueIndex" json:"phone"`
	PINHash      string         `gorm:"type:varchar(255);not null" json:"-"` // Explicitly ignored in JSON serialization
	FacilityName string         `gorm:"type:varchar(100)" json:"facility_name"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
