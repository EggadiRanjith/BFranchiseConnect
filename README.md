
# Backend API Server

Welcome to the backend API server for your project! This Node.js application serves as the backbone for handling data interactions, authentication, and real-time communication.

## Features

### 1. Express Framework
   - **Description**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
   - **Usage**: Utilize Express to create APIs, handle HTTP requests, and manage routes efficiently.

### 2. Middleware
   - **Body-Parser**: Parse incoming request bodies in a middleware before handlers, available under the `req.body` property.
   - **CORS (Cross-Origin Resource Sharing)**: Enable CORS to allow client applications from different origins to interact with the server API.
   - **Express File Upload**: Middleware for handling file uploads via HTTP POST request.

### 3. Authentication & Security
   - **JSON Web Tokens (JWT)**: Securely transmit information between parties as a JSON object. Use JWT for user authentication and authorization.
   - **Sequelize**: A promise-based ORM for Node.js that supports multiple database dialects. Utilize Sequelize for easy and efficient database operations and management.
   - **Socket.IO**: Enable real-time, bidirectional, and event-based communication between clients and the server using WebSocket protocol.

### 4. Database
   - **MySQL & MySQL2**: MySQL and its Node.js client provide reliable database management and interaction. MySQL2 is a fast and feature-rich MySQL client for Node.js.
   - **Sequelize & Sequelize CLI**: Sequelize ORM simplifies database interactions, migrations, and associations, enhancing productivity and maintainability.

### 5. Dependencies
   - **Express**: "^4.18.3"
   - **Body-Parser**: "^1.20.2"
   - **CORS**: "^2.8.5"
   - **Express File Upload**: "^1.5.0"
   - **JSON Web Token**: "^9.0.2"
   - **MySQL**: "^2.18.1"
   - **MySQL2**: "^3.9.1"
   - **Sequelize**: "^6.37.1"
   - **Sequelize CLI**: "^6.6.2"
   - **Socket.IO**: "^4.7.4"
   - **WebSocket**: "^8.16.0"

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EggadiRanjith/BfranchiseConnect.git
   ```

2. Navigate to the project directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Set up environment variables for configuration such as database connection details, JWT secret, and other sensitive information.
2. Modify `config/config.json` to configure Sequelize database connection parameters.

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Access the API endpoints and WebSocket services as needed.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please submit a pull request or open an issue.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE.txt) file for details.

## Support

For support or inquiries, please contact ranjitheggadi@gmail.com
