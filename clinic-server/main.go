package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var db *sql.DB

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading it, using system environment variables")
	}

	// Connect to Database
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("WARNING: DATABASE_URL is not set. Running in Offline In-Memory Mode.")
		isOfflineMode = true
	} else {
		var err error
		db, err = sql.Open("pgx", dbURL)
		if err != nil {
			log.Println("WARNING: Failed to open database:", err)
			isOfflineMode = true
		} else {
			if err := db.Ping(); err != nil {
				log.Println("WARNING: Failed to ping database. Switching to Offline In-Memory Mode. Error:", err)
				isOfflineMode = true
			} else {
				log.Println("Connected to Neon PostgreSQL Database successfully")
				defer db.Close()
			}
		}
	}

	// Set up Gin Router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Routes
	v1 := r.Group("/api/v1")
	{
		v1.GET("/patients", getPatients)
		v1.GET("/patients/:id/history", getPatientHistory)
		v1.POST("/patients", createPatient)
		v1.POST("/dhis2/sync", dhis2SyncHandler)
		
		// Clinic Flow Queues
		v1.GET("/queues/triage", getTriageQueue)
		v1.GET("/queues/consultation", getConsultationQueue)
		v1.GET("/queues/laboratory", getLaboratoryQueue)
		v1.GET("/queues/pharmacy", getPharmacyQueue)
		v1.GET("/queues/billing", getBillingQueue)

		// Clinical Actions
		v1.POST("/encounters", createEncounter)
		v1.POST("/lab-requests", createLabRequest)
		v1.POST("/lab-requests/:id/complete", completeLabRequest)
		v1.POST("/prescriptions", createPrescription)
		v1.POST("/prescriptions/:id/dispense", dispensePrescription)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("Clinic Server running on :%s", port)
	r.Run(":" + port)
}
