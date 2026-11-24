package services

import (
	"errors"
	"restaurant-employee-management/config"
	"restaurant-employee-management/models"
	"restaurant-employee-management/utils"
)

// AdminService handles authentication logic.
type AdminService struct{}

// RegisterInput is the payload for admin registration.
type RegisterInput struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginInput is the payload for admin login.
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register creates a new admin account.
func (s *AdminService) Register(input RegisterInput) (*models.Admin, error) {
	// Check duplicate email
	var existing models.Admin
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		return nil, errors.New("email already registered")
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	admin := &models.Admin{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashed,
	}

	if err := config.DB.Create(admin).Error; err != nil {
		return nil, errors.New("failed to create admin")
	}

	return admin, nil
}

// Login authenticates an admin and returns the admin record.
func (s *AdminService) Login(input LoginInput) (*models.Admin, error) {
	var admin models.Admin
	if err := config.DB.Where("email = ?", input.Email).First(&admin).Error; err != nil {
		return nil, errors.New("invalid credentials")
	}

	if !utils.CheckPassword(input.Password, admin.Password) {
		return nil, errors.New("invalid credentials")
	}

	return &admin, nil
}
