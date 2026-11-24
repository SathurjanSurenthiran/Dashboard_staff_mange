import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import AttendancePage from './pages/AttendancePage'
import LoadingSpinner from './components/ui/LoadingSpinner'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  return admin ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  return admin ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index                    element={<DashboardPage />} />
            <Route path="employees"         element={<EmployeesPage />} />
            <Route path="employees/:id"     element={<EmployeeDetailPage />} />
            <Route path="attendance"        element={<AttendancePage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
