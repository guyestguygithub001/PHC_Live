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
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("WARNING: DATABASE_URL not set. Running in Offline In-Memory Mode.")
		isOfflineMode = true
	} else {
		var err error
		db, err = sql.Open("pgx", dbURL)
		if err != nil {
			log.Println("WARNING: Failed to open database:", err, "— switching to Offline Mode.")
			isOfflineMode = true
		} else {
			if err := db.Ping(); err != nil {
				log.Println("WARNING: Database unreachable. Switching to Offline In-Memory Mode. Error:", err)
				isOfflineMode = true
			} else {
				log.Println("Connected to Neon PostgreSQL successfully")
				defer db.Close()
			}
		}
	}

	r := gin.Default()

	// CORS — open for now; tighten to specific origin in production
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

	v1 := r.Group("/api/v1")
	{
		// Patient management
		v1.GET("/patients", getPatients)
		v1.POST("/patients", createPatient)
		v1.PUT("/patients/:id", updatePatient)
		v1.GET("/patients/:id/history", getPatientHistory)
		v1.GET("/patients/:id/audit-log", getPatientAuditLog)

		// ANC / maternal care
		v1.POST("/patients/:id/enroll-anc", enrollANC)
		v1.POST("/patients/newborn", createNewborn)

		// Golden Record admin tools
		v1.POST("/patients/merge", mergePatients)
		v1.GET("/patients/duplicates", getDuplicates)

		// DHIS2 reporting
		v1.POST("/dhis2/sync", dhis2SyncHandler)

		// Clinic flow queues
		v1.GET("/queues/triage", getTriageQueue)
		v1.GET("/queues/consultation", getConsultationQueue)
		v1.GET("/queues/laboratory", getLaboratoryQueue)
		v1.GET("/queues/pharmacy", getPharmacyQueue)
		v1.GET("/queues/billing", getBillingQueue)

		// Clinical actions
		v1.POST("/encounters", createEncounter)
		v1.POST("/lab-requests", createLabRequest)
		v1.POST("/lab-requests/:id/complete", completeLabRequest)
		v1.POST("/prescriptions", createPrescription)
		v1.POST("/prescriptions/:id/dispense", dispensePrescription)
	}

	r.GET("/health", func(c *gin.Context) {
		mode := "online"
		if isOfflineMode {
			mode = "offline"
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok", "mode": mode})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	log.Printf("PHC Live server running on :%s (offline=%v)", port, isOfflineMode)
	r.Run(":" + port)
}
