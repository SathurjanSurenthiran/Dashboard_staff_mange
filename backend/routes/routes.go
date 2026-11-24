package routes

import (
	"github.com/gin-gonic/gin"
	"restaurant-employee-management/handlers"
	"restaurant-employee-management/middleware"
)

// SetupRoutes registers all API routes.
func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Auth routes (public) 
	auth := api.Group("/auth")
	{
		adminH := handlers.NewAdminHandler()
		auth.POST("/register", adminH.Register)
		auth.POST("/login", adminH.Login)
		auth.POST("/logout", adminH.Logout)
		auth.GET("/me", middleware.AuthRequired(), adminH.Me)
	}

	// Protected routes 
	protected := api.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		// Dashboard
		dashH := handlers.NewDashboardHandler()
		protected.GET("dashboard/stats", dashH.Stats)

		// Employees
		empH := handlers.NewEmployeeHandler()
		protected.GET("employees", empH.List)
		protected.POST("employees", empH.Create)
		protected.GET("employees/:id", empH.Get)
		protected.PUT("employees/:id", empH.Update)
		protected.DELETE("employees/:id", empH.Delete)

		// Attendance
		attH := handlers.NewAttendanceHandler()
		protected.POST("attendance/clock-in", attH.ClockIn)
		protected.PUT("attendance/:id/clock-out", attH.ClockOut)
		protected.GET("attendance", attH.List)
		protected.GET("attendance/today", attH.Today)
		protected.GET("attendance/active/:employee_id", attH.ActiveSession)
	}
}
