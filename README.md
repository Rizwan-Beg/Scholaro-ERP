# 🎓 Scholaro ERP — Authentication Module

A modern, responsive School ERP System authentication module with **Login** and **Registration** pages.

Built with **Spring Boot** (Java) for the backend, **ReactJS** for the frontend, and **MySQL** for the database.

---

## 📋 Features

- ✅ Professional Login & Registration pages
- ✅ JWT-based authentication for secure sessions
- ✅ BCrypt password encryption
- ✅ Role-based registration (Student, Teacher, Admin)
- ✅ Client-side + server-side form validation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states and smooth animations
- ✅ Toast notifications for success/error messages
- ✅ REST API with proper error handling
- ✅ Spring Security integration
- ✅ Axios interceptors for automatic JWT attachment
- ✅ Clean, scalable project architecture

---

## 🛠 Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 19, Vite, React Router v6, Axios    |
| Backend    | Spring Boot 3.2, Spring Security, JPA     |
| Database   | MySQL 8+                                  |
| Auth       | JWT (jjwt library), BCrypt                |
| Styling    | Vanilla CSS (custom design system)        |
| Language   | Java 17 (backend), JavaScript (frontend)  |

---

## 📁 Project Structure

```
scholar-entrypoint-main/
│
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/scholaro/erp/
│   │   ├── ScholaroErpApplication.java       # Main entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java           # Spring Security + JWT config
│   │   │   └── CorsConfig.java              # CORS for React dev server
│   │   ├── controller/
│   │   │   └── AuthController.java           # REST API endpoints
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java          # Registration DTO
│   │   │   ├── LoginRequest.java             # Login DTO
│   │   │   └── AuthResponse.java             # Response DTO
│   │   ├── model/
│   │   │   └── User.java                    # JPA Entity
│   │   ├── repository/
│   │   │   └── UserRepository.java           # Data access layer
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java         # JWT generation & validation
│   │   │   ├── JwtAuthenticationFilter.java  # JWT request filter
│   │   │   └── CustomUserDetailsService.java # User lookup for Spring Security
│   │   └── service/
│   │       └── AuthService.java              # Business logic
│   ├── src/main/resources/
│   │   └── application.properties            # Configuration
│   └── pom.xml                               # Maven dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                     # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx               # Shared auth layout
│   │   │   └── ProtectedRoute.jsx           # Route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx              # Auth state management
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx                # Login form
│   │   │   ├── RegisterPage.jsx             # Registration form
│   │   │   └── HomePage.jsx                 # Authenticated home
│   │   ├── App.jsx                          # Router setup
│   │   ├── main.jsx                         # Entry point
│   │   └── index.css                        # Complete design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── schema.sql                        # MySQL database schema
└── README.md                         # This file
```

---

## 🚀 Setup & Run Instructions

### Prerequisites

Make sure you have the following installed:

| Software  | Version   | Download                                    |
|-----------|-----------|---------------------------------------------|
| Java JDK  | 17+       | https://adoptium.net/                       |
| Maven     | 3.8+      | https://maven.apache.org/download.cgi       |
| Node.js   | 18+       | https://nodejs.org/                         |
| MySQL     | 8.0+      | https://dev.mysql.com/downloads/            |

---

### Step 1: Set Up the Database

1. Start your MySQL server.

2. Run the schema file to create the database and table:

```bash
mysql -u root -p < schema.sql
```

Or log into MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS scholaro_erp;
USE scholaro_erp;

CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone_number    VARCHAR(20)     NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    role            ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

3. Update the MySQL credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=1234567890
```

---

### Step 2: Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot server will start on **http://localhost:8080**.

> **Note:** On the first run, Maven will download all dependencies. This may take a few minutes.

---

### Step 3: Run the Frontend

```bash
cd frontend
npm install        # Only needed on first run
npm run dev
```

The React dev server will start on **http://localhost:5173**.

---

### Step 4: Open in Browser

Navigate to **http://localhost:5173** in your browser.

- Click **"Create an account"** to register
- Click **"Sign in"** to log in
- After login, you'll see the authenticated home page with your profile info

---

## 🔌 API Endpoints

| Method | Endpoint             | Auth     | Description                |
|--------|----------------------|----------|----------------------------|
| POST   | `/api/auth/register` | Public   | Register a new user        |
| POST   | `/api/auth/login`    | Public   | Login and receive JWT      |
| GET    | `/api/auth/me`       | JWT      | Get current user profile   |

### Register Request Body

```json
{
  "fullName": "Jane Doe",
  "email": "jane@school.edu",
  "phoneNumber": "+1 555 000 1234",
  "password": "mypassword123",
  "confirmPassword": "mypassword123",
  "role": "STUDENT"
}
```

### Login Request Body

```json
{
  "email": "jane@school.edu",
  "password": "mypassword123"
}
```

### Successful Auth Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "email": "jane@school.edu",
  "fullName": "Jane Doe",
  "role": "STUDENT",
  "message": "Login successful — welcome back!"
}
```

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using BCrypt (strength 10) before storage
- **JWT Authentication**: Stateless token-based auth with configurable expiration (default: 24 hours)
- **Spring Security**: Full integration with filter chain, authentication provider, and CORS config
- **Input Validation**: Both client-side (JavaScript) and server-side (Bean Validation) validation
- **SQL Injection Protection**: Parameterized queries via Spring Data JPA
- **CORS Configuration**: Only allows requests from the React frontend origin

---

## 🎨 Design

- **Color Palette**: Deep Indigo primary, Royal Blue secondary, Warm Amber accents
- **Typography**: Inter (Google Fonts) — clean, modern sans-serif
- **Layout**: Split-screen auth pages (brand panel + form panel)
- **Responsive**: Mobile-first design with breakpoints at 640px, 768px, and 1024px
- **Animations**: Fade-in, slide-in, and scale animations for smooth UX
- **Components**: Custom toast notifications, loading spinners, gradient buttons

---

## ⚙️ Configuration

### JWT Settings (`application.properties`)

```properties
# Change the secret key in production!
app.jwt.secret=ScHoLaRoErP2024SecretKeyForJWTAuthenticationModuleXyz!@#

# Token expiration in milliseconds (default: 24 hours)
app.jwt.expiration-ms=86400000
```

### MySQL Connection (`application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/scholaro_erp
spring.datasource.username=root
spring.datasource.password=root
```

### Frontend API URL (`frontend/src/api/axios.js`)

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});
```

---

## 📝 Notes

- This project contains **only the authentication module**. No dashboard or additional ERP features are included.
- The backend uses `spring.jpa.hibernate.ddl-auto=update`, which auto-creates/updates tables. For production, switch to `validate` and use proper migration tools (Flyway/Liquibase).
- JWT secret should be changed to a strong, random value in production.
- CORS is configured for `localhost:5173` only. Update `CorsConfig.java` for production domains.

---

