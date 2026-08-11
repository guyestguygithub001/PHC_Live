package models

import (
	"time"
	"gorm.io/gorm"
)

// Patient represents a registered individual in the PHC.
type Patient struct {
	ID             string         `gorm:"type:uuid;primary_key;" json:"id"` // Offline-safe UUID
	HumanID        string         `gorm:"type:varchar(20);uniqueIndex" json:"human_id"` // e.g. PHC-KAN-0012
	NIN            string         `gorm:"type:varchar(20)" json:"nin"`
	FirstName      string         `gorm:"type:varchar(100);not null" json:"first_name"`
	LastName       string         `gorm:"type:varchar(100);not null" json:"last_name"`
	DOB            time.Time      `json:"dob"`
	Gender         string         `gorm:"type:varchar(10)" json:"gender"`
	Phone          string         `gorm:"type:varchar(20)" json:"phone"`
	Address        string         `gorm:"type:text" json:"address"`
	Tribe          string         `gorm:"type:varchar(50)" json:"tribe"`
	LGAOfOrigin    string         `gorm:"type:varchar(100)" json:"lga_of_origin"`
	NextOfKinName  string         `gorm:"type:varchar(100)" json:"next_of_kin_name"`
	NextOfKinPhone string         `gorm:"type:varchar(20)" json:"next_of_kin_phone"`
	IsArchived     bool           `gorm:"default:false" json:"is_archived"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
