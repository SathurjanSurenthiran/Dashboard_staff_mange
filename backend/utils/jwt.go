package utils

import (
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"restaurant-employee-management/middleware"
)

// GenerateToken creates a signed JWT for the given admin.
func GenerateToken(adminID uint, email string) (string, error) {
	expiryHours := 24
	if h, err := strconv.Atoi(os.Getenv("JWT_EXPIRY_HOURS")); err == nil {
		expiryHours = h
	}

	claims := &middleware.Claims{
		AdminID: adminID,
		Email:   email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(expiryHours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
