package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"restaurant-employee-management/services"
	"restaurant-employee-management/utils"
)

// EmployeeHandler handles employee CRUD endpoints.
type EmployeeHandler struct {
	service services.EmployeeService
}

// NewEmployeeHandler creates a new EmployeeHandler.
func NewEmployeeHandler() *EmployeeHandler {
	return &EmployeeHandler{service: services.EmployeeService{}}
}

// List 
// GET /api/employees
func (h *EmployeeHandler) List(c *gin.Context) {
	pagination := utils.GetPagination(c)
	filter := services.EmployeeFilter{
		Search:           c.Query("search"),
		Position:         c.Query("position"),
		Status:           c.Query("status"),
		PaginationParams: pagination,
	}

	employees, total, err := h.service.ListEmployees(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": employees,
		"meta": utils.BuildMeta(total, pagination),
	})
}

// Create 
// POST /api/employees
func (h *EmployeeHandler) Create(c *gin.Context) {
	var input services.EmployeeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	emp, err := h.service.CreateEmployee(input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": emp, "message": "Employee created successfully"})
}

// Get 
// GET /api/employees/:id
func (h *EmployeeHandler) Get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}

	emp, err := h.service.GetEmployee(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": emp})
}

// Update 
// PUT /api/employees/:id
func (h *EmployeeHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}

	var input services.EmployeeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	emp, err := h.service.UpdateEmployee(uint(id), input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": emp, "message": "Employee updated successfully"})
}

// Delete 
// DELETE /api/employees/:id
func (h *EmployeeHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}

	if err := h.service.DeleteEmployee(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}
