package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"restaurant-employee-management/services"
	"restaurant-employee-management/utils"
)

// AttendanceHandler handles attendance/working time endpoints.
type AttendanceHandler struct {
	service services.AttendanceService
}

// NewAttendanceHandler creates a new AttendanceHandler.
func NewAttendanceHandler() *AttendanceHandler {
	return &AttendanceHandler{service: services.AttendanceService{}}
}

// ClockIn 
// POST /api/attendance/clock-in
func (h *AttendanceHandler) ClockIn(c *gin.Context) {
	var input services.ClockInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	record, err := h.service.ClockIn(input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": record, "message": "Clocked in successfully"})
}

// ClockOut 
// PUT /api/attendance/:id/clock-out
func (h *AttendanceHandler) ClockOut(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attendance ID"})
		return
	}

	var input services.ClockOutInput
	c.ShouldBindJSON(&input) // optional body

	record, err := h.service.ClockOut(uint(id), input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": record, "message": "Clocked out successfully"})
}

// List 
// GET /api/attendance
func (h *AttendanceHandler) List(c *gin.Context) {
	pagination := utils.GetPagination(c)

	var empID uint
	if idStr := c.Query("employee_id"); idStr != "" {
		if id, err := strconv.ParseUint(idStr, 10, 32); err == nil {
			empID = uint(id)
		}
	}

	filter := services.AttendanceFilter{
		EmployeeID:       empID,
		Date:             c.Query("date"),
		PaginationParams: pagination,
	}

	records, total, err := h.service.ListAttendance(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attendance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": records,
		"meta": utils.BuildMeta(total, pagination),
	})
}

// Today 
// GET /api/attendance/today
func (h *AttendanceHandler) Today(c *gin.Context) {
	records, err := h.service.GetTodayAttendance()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch today's attendance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": records})
}

// ActiveSession 
// GET /api/attendance/active/:employee_id
func (h *AttendanceHandler) ActiveSession(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("employee_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}

	record, err := h.service.GetEmployeeActiveSession(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": record})
}
