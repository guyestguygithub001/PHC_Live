package auth

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// IPTracker holds the rate limiter for a specific IP
type IPTracker struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var (
	ipTrackers = make(map[string]*IPTracker)
	mtx        sync.Mutex
)

// Clean up stale IPs every minute
func init() {
	go func() {
		for {
			time.Sleep(1 * time.Minute)
			mtx.Lock()
			for ip, tracker := range ipTrackers {
				if time.Since(tracker.lastSeen) > 3*time.Minute {
					delete(ipTrackers, ip)
				}
			}
			mtx.Unlock()
		}
	}()
}

// getLimiter retrieves or creates a limiter for an IP
func getLimiter(ip string, r rate.Limit, b int) *rate.Limiter {
	mtx.Lock()
	defer mtx.Unlock()

	tracker, exists := ipTrackers[ip]
	if !exists {
		limiter := rate.NewLimiter(r, b)
		ipTrackers[ip] = &IPTracker{limiter: limiter, lastSeen: time.Now()}
		return limiter
	}

	tracker.lastSeen = time.Now()
	return tracker.limiter
}

// RateLimitMiddleware enforces API limits to protect the Edge server from crashing
func RateLimitMiddleware(requestsPerSecond float64, burstSize int) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getLimiter(ip, rate.Limit(requestsPerSecond), burstSize)

		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded. Please slow down.",
				"code":  "429_TOO_MANY_REQUESTS",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
