package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Claims defines the JWT payload structure.
type Claims struct {
	AdminID uint   `json:"admin_id"`
	Email   string `json:"email"`
	jwt.RegisteredClaims
}

// AuthRequired validates the JWT from HTTP-only cookie or Authorization header.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenStr string

		// 1. Try cookie first
		if cookie, err := c.Cookie("auth_token"); err == nil {
			tokenStr = cookie
		}

		// 2. Fall back to Bearer header
		if tokenStr == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		c.Set("admin_id", claims.AdminID)
		c.Set("admin_email", claims.Email)
		c.Next()
	}
}
