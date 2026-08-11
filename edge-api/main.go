package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/guyestguygithub001/PHC_Live/edge-api/auth"
	"github.com/guyestguygithub001/PHC_Live/edge-api/database"
	"github.com/guyestguygithub001/PHC_Live/edge-api/sync"
)

func main() {
	fmt.Println("Starting PHC_Live Edge API...")
	
	// Initialize Database Connection
	database.ConnectDB()

	r := gin.Default()

	// Apply Rate Limiting: 100 requests per second, max burst of 50
	r.Use(auth.RateLimitMiddleware(100.0, 50))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong from the Edge Server",
			"status": "online",
		})
	})

	// API Version 1 Group
	v1 := r.Group("/api/v1")
	v1.Use(auth.AuthMiddleware())
	{
		v1.GET("/sync", sync.PullHandler)
		v1.POST("/sync", sync.PushHandler)
	}

	// Run on local edge port
	r.Run("0.0.0.0:8080")
}
