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
	ID        string         `gorm:"primaryKey;type:varchar(50)" json:"id"` // WatermelonDB UUID
	FullName  string         `gorm:"type:varchar(100);not null" json:"full_name"`
	Phone     string         `gorm:"uniqueIndex;type:varchar(20);not null" json:"phone"`
	PINHash   string         `gorm:"type:varchar(255);not null" json:"-"` // Hashed 4-digit PIN for quick login
	Role      Role           `gorm:"type:varchar(50);not null" json:"role"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
