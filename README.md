# Artcraft Bus Ticket Booking System

A full-stack web application for booking bus tickets with user authentication and real-time bus search functionality.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Backend Code Explanation](#4-backend-code-explanation)
5. [Frontend Code Explanation](#5-frontend-code-explanation)
6. [Setup Instructions](#6-setup-instructions-from-scratch)
7. [How to Use](#7-how-to-use-the-application)
8. [Security Features](#8-security-features)
9. [Features Summary](#9-features-summary)

---

## 1. Project Overview

This is a **full-stack web application** for booking bus tickets online. It allows users to:

- Register and login
- Search for buses between cities
- View available buses with prices, timings, and seat availability

---

## 2. Technology Stack

| Layer                  | Technology                    |
|------------------------|-------------------------------|
| **Frontend**           | React.js 19                   |
| **Backend**            | Node.js + Express.js 5        |
| **Database**           | MongoDB with Mongoose         |
| **Authentication**     | JWT (JSON Web Tokens)        |
| **Password Security**  | bcryptjs                      |

---

## 3. Project Architecture

```
BookingSystem/
├── backend/                         # Node.js API Server
│   ├── src/
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.js   # Authentication logic
│   │   │   ├── busController.js    # Bus operations
│   │   │   └── userController.js    # User management
│   │   ├── models/                 # Database schemas
│   │   │   ├── User.js             # User model
│   │   │   └── Bus.js              # Bus model
│   │   ├── routes/                 # API endpoints
│   │   │   ├── auth.js             # Auth routes
│   │   │   ├── bus.js              # Bus routes
│   │   │   └── user.js             # User routes
│   │   ├── middleware/             # Auth middleware
│   │   │   └── auth.js
│   │   ├── config/                 # DB connection
│   │   │   └── db.js
│   │   ├── data/                   # Seed data
│   │   │   └── seedBuses.js
│   │   └── app.js                  # Express app
│   ├── server.js                   # Entry point
│   ├── package.json
│   └── .env                        # Environment variables
│
└── frontend/                        # React Client
    ├── src/
    │   ├── Components/             # UI Components
    │   │   ├── Navbar.js           # Navigation bar
    │   │   ├── Footer.js           # Footer
    │   │   ├── Home.js             # Dashboard
    │   │   ├── Search.js           # Bus search
    │   │   ├── Results.js          # Search results
    │   │   ├── Help.js             # Help page
    │   │   ├── AuthPageLogIn.js    # Login page
    │   │   ├── AuthPageSignUp.js   # Signup page
    │   │   └── ForgetPass.js       # Password recovery
    │   ├── Assets/                 # Images and assets
    │   ├── App.js                  # Main routing
    │   ├── index.js                # Entry point
    │   └── App.css                 # Styles
    ├── public/
    ├── package.json
    └── .env                        # Environment variables
```

---

## 4. Backend Code Explanation

### 4.1 Database Connection (`src/config/db.js`)

- Connects to MongoDB using Mongoose
- Handles connection errors gracefully
- Provides async/await pattern for database operations

### 4.2 Models

#### User Model (`src/models/User.js`)

- **Stores:** name, email, password (hashed)
- **Includes:** password comparison method
- **Validation:** Email validation with regex
- **Security:** Password field is excluded from queries by default

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

#### Bus Model (`src/models/Bus.js`)

- **Stores:** bus details, route (from/to), times, price, seats
- **Types:** Standard, Express, Luxury, Sleeper
- **Indexes:** route for fast searching
- **Features:** Operating days, amenities

```javascript
{
  busName: String (required),
  from: String (required),
  to: String (required),
  departureTime: String (required),
  arrivalTime: String (required),
  price: Number (required),
  totalSeats: Number (required),
  availableSeats: Number (required),
  busType: String (Standard/Express/Luxury/Sleeper),
  amenities: [String],
  operatingDays: [String]
}
```

### 4.3 Controllers

#### authController.js - Handles Authentication

- **`signup`**: Creates user with hashed password, returns JWT token
  - Validates email uniqueness
  - Hashes password with bcryptjs
  - Generates JWT token for session
  
- **`login`**: Validates credentials, returns JWT token
  - Finds user by email
  - Compares password hash
  - Returns token and user info
  
- **`forgetPassword`**: Generates random password (for demo)
  - Finds user by email
  - Generates random password
  - Hashes and saves new password

#### busController.js - Handles Bus Operations

- **`searchBuses`**: Finds buses by route + date + available seats
  - Accepts from, to, date parameters
  - Converts city names to uppercase
  - Filters by operating days
  - Sorts by departure time
  
- **`getAllBuses`**: Returns all buses
  - Sorts by route (from, to)
  
- **`addBus`**: Adds new bus (admin)
  - Creates new bus entry

### 4.4 API Routes

| Endpoint                  | Method | Description              |
|---------------------------|--------|--------------------------|
| `/api/signup`             | POST   | Register new user       |
| `/api/login`              | POST   | User login              |
| `/api/forgetpassword`     | POST   | Reset password          |
| `/api/search`             | POST   | Search buses            |
| `/api/all`                | GET    | Get all buses           |
| `/api/user/:email`        | GET    | Get user by email       |
| `/api/profile`            | GET    | Get user profile        |
| `/api/add`                | POST   | Add new bus             |

---

## 5. Frontend Code Explanation

### 5.1 App.js - Main Router

- Uses React Router for navigation
- Defines all application routes
- Wraps components with Router

**Routes:**
- `/` - Login page (default)
- `/login` - Login page
- `/signup` - Registration page
- `/forgetpass` - Password recovery
- `/home` - User dashboard
- `/search` - Bus search
- `/results` - Search results
- `/help` - Help/FAQ page

### 5.2 Components

| Component           | Purpose                              | File Location           |
|---------------------|--------------------------------------|-------------------------|
| `Navbar`            | Top navigation bar                  | Components/Navbar.js    |
| `Footer`            | Bottom footer                        | Components/Footer.js    |
| `AuthPageLogIn`     | Login form                           | Components/AuthPageLogIn.js |
| `AuthPageSignUp`    | Registration form                    | Components/AuthPageSignUp.js |
| `Home`              | User dashboard after login           | Components/Home.js      |
| `Search`            | Bus search form (from/to/date)       | Components/Search.js    |
| `Results`           | Display available buses             | Components/Results.js   |
| `Help`              | Help/FAQ page                       | Components/Help.js      |
| `ForgetPass`        | Password recovery                   | Components/ForgetPass.js |

### 5.3 Key Features in Frontend

- **Session Storage:** Stores user email for authentication state
- **Axios:** HTTP client for API calls
- **React Router:** Client-side routing
- **Environment Variables:** API URL configuration

---

## 6. Setup Instructions (From Scratch)

### 6.1 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (installed locally or use MongoDB Atlas)

---

### 6.2 Backend Setup

**Step 1:** Navigate to backend directory

```bash
cd backend
```

**Step 2:** Install dependencies

```bash
npm install
```

**Step 3:** Create `.env` file in the backend folder

Create a file named `.env` and add the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketbooking
JWT_SECRET=your_secret_key_here_make_it_long_and_random
```

**Step 4:** Start MongoDB (if running locally)

```bash
mongod
```

**Step 5:** Start the backend server

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start
```

**Step 6:** (Optional) Seed sample bus data

```bash
npm run seed
```

---

### 6.3 Frontend Setup

**Step 1:** Navigate to frontend directory

```bash
cd frontend
```

**Step 2:** Install dependencies

```bash
npm install
```

**Step 3:** Create `.env` file in the frontend folder

Create a file named `.env` and add the following:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Step 4:** Start the frontend development server

```bash
npm start
```

---

### 6.4 Access the Application

- Open **http://localhost:3000** in your web browser

---

## 7. How to Use the Application

1. **Open the app** → Login page appears
2. **Click "Sign Up"** to create a new account
3. **After login** → Dashboard with "Search Bus" option
4. **Enter search criteria:** From City, To City, Date
5. **Click Search** → View available buses with prices
6. **Select a bus** to book (booking functionality can be extended)

---

## 8. Security Features

1. **Password Hashing** - bcryptjs encrypts passwords before storage
2. **JWT Tokens** - Secure session management for authentication
3. **Input Validation** - Server-side validation on all user inputs
4. **CORS** - Cross-origin resource sharing properly configured
5. **Environment Variables** - Secrets not hardcoded in source code
6. **Secure Error Handling** - No sensitive information exposed in errors

---

## 9. Features Summary

### Frontend Features

- User authentication (Login, Sign Up, Forget Password)
- Bus search functionality
- User dashboard
- Responsive design
- React Router navigation

### Backend Features

- RESTful API with Express.js
- JWT-based authentication
- MongoDB database with Mongoose ODM
- Bus search with filtering by route and date
- Secure password handling with bcryptjs

---

## Testing

The application includes sample bus data for testing purposes. You can:

- Modify the seed data in `backend/src/data/seedBuses.js`
- Add new buses through the API endpoint
- Test with different routes and dates

---

## License

This project is licensed under the ISC License.

---

*Artcraft Booking System - Bus Ticket Booking Application*
