package models

import (
	"time"

	"gorm.io/gorm"
)

// Attendance records an employee's daily working session.
type Attendance struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	EmployeeID uint           `gorm:"not null;index" json:"employee_id"`
	Date       time.Time      `gorm:"type:date;not null;index" json:"date"`
	StartTime  time.Time      `gorm:"not null" json:"start_time"`
	EndTime    *time.Time     `json:"end_time"`
	TotalHours *float64       `gorm:"type:decimal(5,2)" json:"total_hours"`
	Notes      string         `gorm:"type:text" json:"notes"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	// Associations
	Employee Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
}
