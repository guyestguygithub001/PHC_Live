package models

import (
	"time"
	"gorm.io/gorm"
)

// InventoryItem represents a drug or supply in the PHC.
type InventoryItem struct {
	ID           string         `gorm:"type:uuid;primary_key;" json:"id"` // Offline-safe UUID
	ItemName     string         `gorm:"type:varchar(100);not null" json:"item_name"`
	Category     string         `gorm:"type:varchar(50)" json:"category"` // e.g. "Antimalarial", "Antibiotic"
	StockLevel   int            `json:"stock_level"`
	ReorderLevel int            `json:"reorder_level"`
	UnitCost     float64        `json:"unit_cost"`
	IsDRF        bool           `gorm:"default:true" json:"is_drf"` // Drug Revolving Fund tracking
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
