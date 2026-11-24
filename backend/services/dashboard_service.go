package services

import (
	"time"

	"restaurant-employee-management/config"
	"restaurant-employee-management/models"
)

// DashboardService aggregates dashboard statistics.
type DashboardService struct{}

// DashboardStats holds all KPIs for the dashboard.
type DashboardStats struct {
	TotalEmployees    int64              `json:"total_employees"`
	ActiveEmployees   int64              `json:"active_employees"`
	InactiveEmployees int64              `json:"inactive_employees"`
	CurrentlyWorking  int64              `json:"currently_working"`
	TodayAttendance   int64              `json:"today_attendance"`
	RecentActivities  []RecentActivity   `json:"recent_activities"`
}

// RecentActivity is a lightweight activity item.
type RecentActivity struct {
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

// GetStats computes and returns dashboard statistics.
func (s *DashboardService) GetStats() (*DashboardStats, error) {
	stats := &DashboardStats{}

	// Employee counts
	config.DB.Model(&models.Employee{}).Count(&stats.TotalEmployees)
	config.DB.Model(&models.Employee{}).Where("status = ?", models.StatusActive).Count(&stats.ActiveEmployees)
	config.DB.Model(&models.Employee{}).Where("status = ?", models.StatusInactive).Count(&stats.InactiveEmployees)

	// Currently clocked in (active session today, no end_time)
	today := time.Now().UTC().Truncate(24 * time.Hour)
	config.DB.Model(&models.Attendance{}).
		Where("date = ? AND end_time IS NULL", today).
		Count(&stats.CurrentlyWorking)

	// Total attendance records today
	config.DB.Model(&models.Attendance{}).
		Where("date = ?", today).
		Count(&stats.TodayAttendance)

	// Recent activities: last 10 clock-ins/outs
	var recentAttendances []models.Attendance
	config.DB.Preload("Employee").
		Order("updated_at DESC").
		Limit(10).
		Find(&recentAttendances)

	for _, a := range recentAttendances {
		if a.EndTime != nil {
			stats.RecentActivities = append(stats.RecentActivities, RecentActivity{
				Type:      "clock_out",
				Message:   a.Employee.Name + " clocked out",
				Timestamp: *a.EndTime,
			})
		} else {
			stats.RecentActivities = append(stats.RecentActivities, RecentActivity{
				Type:      "clock_in",
				Message:   a.Employee.Name + " clocked in",
				Timestamp: a.StartTime,
			})
		}
	}

	return stats, nil
}
