package database

import (
	"log"
	"os"

	"github.com/guyestguygithub001/PHC_Live/edge-api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto Migrate the schemas
	log.Println("Running AutoMigrations...")
	err = db.AutoMigrate(
		&models.User{},
		&models.Patient{},
		&models.Encounter{},
		&models.Vital{},
		&models.Drug{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connection established and migrated successfully.")
	DB = db
}
