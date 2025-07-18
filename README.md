# MedVault - Medical Report System

A Node.js-based medical report management system built with Express.js, PostgreSQL, and Sequelize ORM.

## Features

- User authentication with JWT
- Medical report creation and management
- File upload support with Multer
- PostgreSQL database with Sequelize ORM
- RESTful API design
- Input validation and error handling

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MedVault
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
   - Create a new PostgreSQL database named `medvault`
   - Update database credentials in your `.env` file

4. Create a `.env` file in the root directory:
```env
# Database Configuration
DB_NAME=medvault
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String, Required, Hashed)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Reports Table
- `id` (UUID, Primary Key)
- `patientName` (String, Required)
- `patientAge` (Integer, Required)
- `patientGender` (Enum: male/female/other)
- `diagnosis` (Text, Required)
- `description` (Text, Optional)
- `fileName` (String, Optional)
- `filePath` (String, Optional)
- `fileSize` (Integer, Optional)
- `mimeType` (String, Optional)
- `status` (Enum: pending/reviewed/completed)
- `userId` (UUID, Foreign Key to Users)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## API Endpoints

### Authentication
- `POST` - Register a new user
- `POST` - User login

### Reports
- `GET` - Get all reports (authenticated)
- `POST` - Create a new report (authenticated)
- `GET` - Get specific report (authenticated)
- `PUT` - Update report (authenticated)
- `DELETE` - Delete report (authenticated)

## Development

The application uses ES6 modules and modern JavaScript features. The database connection is automatically established on server startup, and tables are synced using Sequelize.

### Project Structure
```
MedVault/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── userController.js  # User authentication logic
│   └── reportController.js # Report management logic
├── middleware/
│   ├── authMiddleware.js  # JWT authentication middleware
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── User.js           # User model with Sequelize
│   └── Report.js         # Report model with Sequelize
├── routes/
│   ├── userRoutes.js     # User authentication routes
│   └── reportRoutes.js   # Report management routes
├── utils/
│   ├── generateToken.js  # JWT token generation
│   └── validators.js     # Input validation utilities
├── uploads/              # File upload directory
├── app.js               # Express app configuration
├── server.js            # Server entry point
└── package.json         # Dependencies and scripts
```

## Contributing

This is a boilerplate project for interns. Feel free to extend the functionality by:

1. Adding more detailed report fields
2. Implementing report search and filtering
3. Adding user roles and permissions
4. Implementing email notifications
5. Adding comprehensive test coverage

## License

MIT License