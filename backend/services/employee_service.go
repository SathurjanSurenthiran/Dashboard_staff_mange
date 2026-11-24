package services

import (
	"errors"
	"strings"
	"time"

	"restaurant-employee-management/config"
	"restaurant-employee-management/models"
	"restaurant-employee-management/utils"
)

// EmployeeService handles employee business logic.
type EmployeeService struct{}

// EmployeeInput is the payload for create/update.
type EmployeeInput struct {
	Name        string  `json:"name" binding:"required,min=2,max=100"`
	Email       string  `json:"email" binding:"required,email"`
	Phone       string  `json:"phone"`
	Address     string  `json:"address"`
	Position    string  `json:"position" binding:"required"`
	Salary      float64 `json:"salary" binding:"required,gt=0"`
	JoiningDate string  `json:"joining_date" binding:"required"`
	Status      string  `json:"status"`
}

// EmployeeFilter holds query params for listing.
type EmployeeFilter struct {
	Search   string
	Position string
	Status   string
	utils.PaginationParams
}

// ListEmployees returns a paginated, filtered list of employees.
func (s *EmployeeService) ListEmployees(f EmployeeFilter) ([]models.Employee, int64, error) {
	db := config.DB.Model(&models.Employee{})

	if f.Search != "" {
		search := "%" + strings.ToLower(f.Search) + "%"
		db = db.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(position) LIKE ?",
			search, search, search)
	}
	if f.Position != "" {
		db = db.Where("position = ?", f.Position)
	}
	if f.Status != "" {
		db = db.Where("status = ?", f.Status)
	}

	var total int64
	db.Count(&total)

	var employees []models.Employee
	err := db.Order("created_at DESC").
		Limit(f.Limit).
		Offset(f.Skip).
		Find(&employees).Error

	return employees, total, err
}

// CreateEmployee inserts a new employee record.
func (s *EmployeeService) CreateEmployee(input EmployeeInput) (*models.Employee, error) {
	// Check duplicate email
	var existing models.Employee
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		return nil, errors.New("email already in use")
	}

	joiningDate, err := time.Parse("2006-01-02", input.JoiningDate)
	if err != nil {
		return nil, errors.New("invalid joining_date format, use YYYY-MM-DD")
	}

	status := models.StatusActive
	if input.Status == string(models.StatusInactive) {
		status = models.StatusInactive
	}

	emp := &models.Employee{
		Name:        input.Name,
		Email:       input.Email,
		Phone:       input.Phone,
		Address:     input.Address,
		Position:    input.Position,
		Salary:      input.Salary,
		JoiningDate: joiningDate,
		Status:      status,
	}

	if err := config.DB.Create(emp).Error; err != nil {
		return nil, errors.New("failed to create employee")
	}

	return emp, nil
}

// GetEmployee returns a single employee by ID.
func (s *EmployeeService) GetEmployee(id uint) (*models.Employee, error) {
	var emp models.Employee
	if err := config.DB.First(&emp, id).Error; err != nil {
		return nil, errors.New("employee not found")
	}
	return &emp, nil
}

// UpdateEmployee patches an employee record.
func (s *EmployeeService) UpdateEmployee(id uint, input EmployeeInput) (*models.Employee, error) {
	var emp models.Employee
	if err := config.DB.First(&emp, id).Error; err != nil {
		return nil, errors.New("employee not found")
	}

	// Check email uniqueness (excluding self)
	var conflict models.Employee
	if err := config.DB.Where("email = ? AND id != ?", input.Email, id).First(&conflict).Error; err == nil {
		return nil, errors.New("email already in use by another employee")
	}

	joiningDate, err := time.Parse("2006-01-02", input.JoiningDate)
	if err != nil {
		return nil, errors.New("invalid joining_date format, use YYYY-MM-DD")
	}

	status := models.StatusActive
	if input.Status == string(models.StatusInactive) {
		status = models.StatusInactive
	}

	emp.Name = input.Name
	emp.Email = input.Email
	emp.Phone = input.Phone
	emp.Address = input.Address
	emp.Position = input.Position
	emp.Salary = input.Salary
	emp.JoiningDate = joiningDate
	emp.Status = status

	if err := config.DB.Save(&emp).Error; err != nil {
		return nil, errors.New("failed to update employee")
	}

	return &emp, nil
}

// DeleteEmployee soft-deletes an employee.
func (s *EmployeeService) DeleteEmployee(id uint) error {
	var emp models.Employee
	if err := config.DB.First(&emp, id).Error; err != nil {
		return errors.New("employee not found")
	}
	return config.DB.Delete(&emp).Error
}
