package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"restaurant-employee-management/services"
)

// DashboardHandler handles dashboard endpoints.
type DashboardHandler struct {
	service services.DashboardService
}

// NewDashboardHandler creates a new DashboardHandler.
func NewDashboardHandler() *DashboardHandler {
	return &DashboardHandler{service: services.DashboardService{}}
}

// Stats 
// GET /api/dashboard/stats
func (h *DashboardHandler) Stats(c *gin.Context) {
	stats, err := h.service.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dashboard stats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})
}
