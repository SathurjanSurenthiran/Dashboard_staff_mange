package services

import (
	"errors"
	"time"

	"restaurant-employee-management/config"
	"restaurant-employee-management/models"
	"restaurant-employee-management/utils"
)

// AttendanceService handles working-time business logic.
type AttendanceService struct{}

// ClockInInput is the request body for clock-in.
type ClockInInput struct {
	EmployeeID uint   `json:"employee_id" binding:"required"`
	Notes      string `json:"notes"`
}

// ClockOutInput is the request body for clock-out.
type ClockOutInput struct {
	Notes string `json:"notes"`
}

// AttendanceFilter holds list query params.
type AttendanceFilter struct {
	EmployeeID uint
	Date       string // YYYY-MM-DD
	utils.PaginationParams
}

// ClockIn records the start of a work session.
func (s *AttendanceService) ClockIn(input ClockInInput) (*models.Attendance, error) {
	// Verify employee exists and is active
	var emp models.Employee
	if err := config.DB.First(&emp, input.EmployeeID).Error; err != nil {
		return nil, errors.New("employee not found")
	}
	if emp.Status != models.StatusActive {
		return nil, errors.New("only active employees can clock in")
	}

	today := time.Now().UTC().Truncate(24 * time.Hour)

	// Prevent duplicate active session (no end_time for today)
	var active models.Attendance
	err := config.DB.Where("employee_id = ? AND date = ? AND end_time IS NULL", input.EmployeeID, today).
		First(&active).Error
	if err == nil {
		return nil, errors.New("employee already has an active clock-in for today")
	}

	now := time.Now().UTC()
	attendance := &models.Attendance{
		EmployeeID: input.EmployeeID,
		Date:       today,
		StartTime:  now,
		Notes:      input.Notes,
	}

	if err := config.DB.Create(attendance).Error; err != nil {
		return nil, errors.New("failed to record clock-in")
	}

	config.DB.Preload("Employee").First(attendance, attendance.ID)
	return attendance, nil
}

// ClockOut records the end of a work session and calculates total hours.
func (s *AttendanceService) ClockOut(attendanceID uint, input ClockOutInput) (*models.Attendance, error) {
	var attendance models.Attendance
	if err := config.DB.First(&attendance, attendanceID).Error; err != nil {
		return nil, errors.New("attendance record not found")
	}
	if attendance.EndTime != nil {
		return nil, errors.New("employee already clocked out")
	}

	now := time.Now().UTC()
	hours := now.Sub(attendance.StartTime).Hours()
	rounded := float64(int(hours*100)) / 100 // 2 decimal places

	attendance.EndTime = &now
	attendance.TotalHours = &rounded
	if input.Notes != "" {
		attendance.Notes = input.Notes
	}

	if err := config.DB.Save(&attendance).Error; err != nil {
		return nil, errors.New("failed to record clock-out")
	}

	config.DB.Preload("Employee").First(&attendance, attendance.ID)
	return &attendance, nil
}

// ListAttendance returns paginated attendance records with optional filters.
func (s *AttendanceService) ListAttendance(f AttendanceFilter) ([]models.Attendance, int64, error) {
	db := config.DB.Model(&models.Attendance{}).Preload("Employee")

	if f.EmployeeID > 0 {
		db = db.Where("attendances.employee_id = ?", f.EmployeeID)
	}
	if f.Date != "" {
		date, err := time.Parse("2006-01-02", f.Date)
		if err == nil {
			db = db.Where("attendances.date = ?", date.UTC().Truncate(24*time.Hour))
		}
	}

	var total int64
	db.Count(&total)

	var records []models.Attendance
	err := db.Order("attendances.date DESC, attendances.start_time DESC").
		Limit(f.Limit).
		Offset(f.Skip).
		Find(&records).Error

	return records, total, err
}

// GetTodayAttendance returns all clock-ins for today.
func (s *AttendanceService) GetTodayAttendance() ([]models.Attendance, error) {
	today := time.Now().UTC().Truncate(24 * time.Hour)
	var records []models.Attendance
	err := config.DB.Preload("Employee").
		Where("date = ?", today).
		Order("start_time DESC").
		Find(&records).Error
	return records, err
}

// GetEmployeeActiveSession returns the open clock-in for an employee (if any).
func (s *AttendanceService) GetEmployeeActiveSession(employeeID uint) (*models.Attendance, error) {
	today := time.Now().UTC().Truncate(24 * time.Hour)
	var attendance models.Attendance
	err := config.DB.Where("employee_id = ? AND date = ? AND end_time IS NULL", employeeID, today).
		First(&attendance).Error
	if err != nil {
		return nil, nil // no active session is not an error
	}
	return &attendance, nil
}
