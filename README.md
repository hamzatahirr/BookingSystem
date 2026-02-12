# Bus Ticket Booking System

A full-stack web application for booking bus tickets with user authentication and real-time bus search functionality.

## Project Structure

```
App/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── Components/    # React components
│   │   └── ...
│   └── package.json
└── backend/           # Node.js/Express backend
    ├── src/
    │   ├── controllers/   # API controllers
    │   ├── models/       # Mongoose models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   ├── config/       # Database configuration
    │   └── data/         # Seed data
    ├── server.js         # Main server file
    └── package.json
```

## Features

### Frontend
- User authentication (Login, Sign Up, Forget Password)
- Bus search functionality
- User dashboard
- Responsive design
- React Router navigation

### Backend
- RESTful API with Express.js
- JWT-based authentication
- MongoDB database with Mongoose ODM
- Bus search with filtering by route and date
- Secure password handling with bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketbooking
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
```

4. Start the server:
```bash
# For development
npm run dev

# For production
npm start
```

5. Seed sample bus data (optional):
```bash
npm run seed
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/forgetpassword` - Password reset

### User Management
- `GET /api/user/:email` - Get user by email
- `GET /api/profile` - Get user profile (requires authentication)

### Bus Operations
- `POST /api/search` - Search buses
- `GET /api/all` - Get all buses
- `POST /api/add` - Add new bus (requires authentication)

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:3000 in your browser
3. Register a new account or login
4. Search for buses by entering departure, destination, and date
5. View available buses and their details

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Bus Model
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

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Secure error handling

## Testing

The application includes sample bus data for testing purposes. You can modify or extend the bus data through the admin endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.