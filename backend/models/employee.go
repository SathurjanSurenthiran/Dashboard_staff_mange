package models

import (
	"time"

	"gorm.io/gorm"
)

// EmployeeStatus represents the employment status.
type EmployeeStatus string

const (
	StatusActive   EmployeeStatus = "active"
	StatusInactive EmployeeStatus = "inactive"
)

// Employee represents a restaurant employee.
type Employee struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string         `gorm:"type:varchar(100);not null;index" json:"name"`
	Email       string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Phone       string         `gorm:"type:varchar(20)" json:"phone"`
	Address     string         `gorm:"type:text" json:"address"`
	Position    string         `gorm:"type:varchar(100);not null;index" json:"position"`
	Salary      float64        `gorm:"type:decimal(12,2);not null" json:"salary"`
	JoiningDate time.Time      `gorm:"type:date;not null" json:"joining_date"`
	Status      EmployeeStatus `gorm:"type:varchar(20);default:'active';index" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Associations
	Attendances []Attendance `gorm:"foreignKey:EmployeeID" json:"attendances,omitempty"`
}
