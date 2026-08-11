package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting PHC_Live Edge API...")

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong from the Edge Server",
			"status": "online",
		})
	})

	r.GET("/sync", func(c *gin.Context) {
		// TODO: Implement WatermelonDB Sync Pull
		c.JSON(http.StatusOK, gin.H{
			"message": "Pull sync endpoint",
		})
	})

	r.POST("/sync", func(c *gin.Context) {
		// TODO: Implement WatermelonDB Sync Push
		c.JSON(http.StatusOK, gin.H{
			"message": "Push sync endpoint",
		})
	})

	// Run on local edge port
	r.Run("0.0.0.0:8080")
}
