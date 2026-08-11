package models

import (
	"time"
	"gorm.io/gorm"
)

// Drug represents an item in the Drug Revolving Fund (DRF) inventory.
type Drug struct {
	ID           string         `gorm:"primaryKey;type:varchar(50)" json:"id"` // WatermelonDB UUID
	Name         string         `gorm:"type:varchar(100);not null" json:"name"` // e.g. "Artemether 80mg"
	Category     string         `gorm:"type:varchar(50)" json:"category"`       // e.g. "Antimalarial"
	StockLevel   int            `json:"stock_level"`
	ReorderLevel int            `json:"reorder_level"`
	UnitCost     float64        `json:"unit_cost"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
