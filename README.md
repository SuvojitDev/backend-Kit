# Auth API with Node.js, Express & MongoDB

A secure authentication API built with Node.js, Express, and MongoDB featuring JWT authentication, password hashing, and password reset functionality.

## Features

- User registration with email verification
- JWT-based authentication
- Password hashing with bcrypt
- Password reset functionality
- Protected routes with middleware
- Error handling and status codes
- MongoDB database integration
- RESTful API design

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## API Endpoints

| Endpoint                | Method | Description                     | Auth Required |
|-------------------------|--------|---------------------------------|---------------|
| `/api/auth/signup`      | POST   | Register a new user             | No            |
| `/api/auth/login`       | POST   | Login existing user             | No            |
| `/api/auth/logout`      | POST   | Logout user                     | Yes           |
| `/api/auth/update-password` | POST | Update user password           | Yes           |
| `/api/auth/forgot-password` | POST | Initiate password reset       | No            |
| `/api/auth/reset-password` | POST  | Complete password reset       | No            |

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/auth-api.git
   cd auth-api
   
2. Install dependencies:
    ```bash
    npm install

3. Create a `.env` file in the root directory and add your environment variables:
    ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
4. Start the development server:
    ```bash
    npm start
5. The server will start on `http://localhost:5000`

---
On Going............................