package models

import (
	"time"
	"gorm.io/gorm"
)

// Patient represents a registered individual in the PHC.
type Patient struct {
	ID             string         `gorm:"primaryKey;type:varchar(50)" json:"id"` // Unique Sync ID (WatermelonDB UUID)
	HumanID        string         `gorm:"uniqueIndex;type:varchar(50)" json:"human_id"` // E.g., PHC-KAN-0012 (Written on card)
	FullName       string         `gorm:"type:varchar(100);not null" json:"full_name"`
	PhoneNumber    string         `gorm:"type:varchar(20)" json:"phone_number"` // Important for OTP/Booking
	NIN            string         `gorm:"type:varchar(20)" json:"nin"`          // National Identity Number
	DateOfBirth    time.Time      `json:"date_of_birth"`
	Gender         string         `gorm:"type:varchar(10)" json:"gender"`
	Address        string         `gorm:"type:text" json:"address"`
	LGAOfOrigin    string         `gorm:"type:varchar(100)" json:"lga_of_origin"`
	Tribe          string         `gorm:"type:varchar(50)" json:"tribe"`
	NextOfKinName  string         `gorm:"type:varchar(100)" json:"next_of_kin_name"`
	NextOfKinPhone string         `gorm:"type:varchar(20)" json:"next_of_kin_phone"`
	IsArchived     bool           `gorm:"default:false" json:"is_archived"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
