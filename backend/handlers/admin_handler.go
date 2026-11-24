package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"restaurant-employee-management/services"
	"restaurant-employee-management/utils"
)

// AdminHandler handles authentication endpoints.
type AdminHandler struct {
	service services.AdminService
}

// NewAdminHandler creates a new AdminHandler.
func NewAdminHandler() *AdminHandler {
	return &AdminHandler{service: services.AdminService{}}
}

// Register 
// POST /api/auth/register
func (h *AdminHandler) Register(c *gin.Context) {
	var input services.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	admin, err := h.service.Register(input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Admin registered successfully",
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
	})
}

// Login 
// POST /api/auth/login
func (h *AdminHandler) Login(c *gin.Context) {
	var input services.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	admin, err := h.service.Login(input)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := utils.GenerateToken(admin.ID, admin.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Determine cookie security based on environment
	secure := os.Getenv("ENV") == "production"
	expiryHours := 24

	c.SetCookie(
		"auth_token",
		token,
		expiryHours*3600,
		"/",
		"",
		secure,
		true, // HTTP-only
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"admin": gin.H{
			"id":    admin.ID,
			"name":  admin.Name,
			"email": admin.Email,
		},
		"expires_at": time.Now().Add(time.Duration(expiryHours) * time.Hour),
	})
}

// Logout godoc
// POST /api/auth/logout
func (h *AdminHandler) Logout(c *gin.Context) {
	secure := os.Getenv("ENV") == "production"
	c.SetCookie("auth_token", "", -1, "/", "", secure, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Me godoc
// GET /api/auth/me
func (h *AdminHandler) Me(c *gin.Context) {
	adminID := c.GetUint("admin_id")
	email := c.GetString("admin_email")
	c.JSON(http.StatusOK, gin.H{
		"admin": gin.H{
			"id":    adminID,
			"email": email,
		},
	})
}
