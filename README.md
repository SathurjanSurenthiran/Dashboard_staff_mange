# Restaurant Employee Management System

A full-stack restaurant employee management system built with Go (backend) and React (frontend).

## Tech Stack

**Backend:** Go · Gin · GORM · PostgreSQL · JWT · bcrypt  
**Frontend:** React · Vite · Tailwind CSS · React Router · Axios · Lucide Icons

---

## Project Structure

```
employee mange/
├── backend/
│   ├── config/          
│   ├── handlers/        
│   ├── middleware/  
│   ├── models/          
│   ├── routes/          
│   ├── services/        
│   ├── utils/          
│   ├── main.go          
│   ├── go.mod
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  
    │   │   ├── attendance/
    │   │   ├── employees/
    │   │   └── ui/
    │   ├── contexts/    
    │   ├── lib/         
    │   ├── pages/       
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## Prerequisites

- **Go** 1.21+
- **Node.js** 18+
- **PostgreSQL** 14+

---

## Setup

### 1. Database

```sql
CREATE DATABASE restaurant_emp_db;
```

### 2. Backend

```bash
cd backend

# Copy env file and configure
copy .env.example .env
# Edit .env with your DB credentials and JWT secret

# Download dependencies
go mod tidy

# Run the server
go run main.go
```

The API starts on **http://localhost:8080**

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The UI starts on **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | /api/auth/register   | Register admin       |
| POST   | /api/auth/login      | Login                |
| POST   | /api/auth/logout     | Logout               |
| GET    | /api/auth/me         | Get current admin    |

### Employees (all protected)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/employees        | List (paginated)     |
| POST   | /api/employees        | Create employee      |
| GET    | /api/employees/:id    | Get employee         |
| PUT    | /api/employees/:id    | Update employee      |
| DELETE | /api/employees/:id    | Delete employee      |

### Attendance (all protected)
| Method | Endpoint                           | Description             |
|--------|------------------------------------|-------------------------|
| POST   | /api/attendance/clock-in           | Clock in                |
| PUT    | /api/attendance/:id/clock-out      | Clock out               |
| GET    | /api/attendance                    | List records (paginated)|
| GET    | /api/attendance/today              | Today's records         |
| GET    | /api/attendance/active/:employee_id| Active session check    |

### Dashboard (protected)
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| GET    | /api/dashboard/stats   | Get all KPIs        |

---

## Features

- 🔐 JWT authentication with HTTP-only cookies
- 👥 Full employee CRUD with search & filter
- ⏰ Clock-in / Clock-out with automatic hours calculation
- 📊 Dashboard with live KPIs and recent activity
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔒 Protected routes on both frontend and backend
- 📄 Pagination on all list endpoints
- 🛡️ Input validation on all forms and APIs
- ✅ Confirmation dialogs for destructive actions
