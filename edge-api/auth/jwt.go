package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/guyestguygithub001/PHC_Live/edge-api/models"
)

var JWTSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	UserID string      `json:"user_id"`
	Role   models.Role `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(user *models.User) (string, error) {
	if len(JWTSecret) == 0 {
		JWTSecret = []byte("default_fallback_secret_for_development") // Should be set in .env
	}

	expirationTime := time.Now().Add(24 * time.Hour) // 1 day token
	claims := &Claims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWTSecret)
}

func ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return JWTSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
