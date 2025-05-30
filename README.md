# Zero Health - Deliberately Vulnerable Healthcare Portal

⚠️ **WARNING: This is a deliberately vulnerable application for educational purposes only. Do not use in production or with real data.**

## Purpose

Zero Health is a deliberately vulnerable healthcare portal designed to demonstrate common security vulnerabilities in web applications. It serves as an educational tool to help developers understand:

- Common web security vulnerabilities
- How these vulnerabilities can be exploited
- Best practices for preventing such vulnerabilities
- The importance of secure coding practices

## Application Features

### Patient Portal
- 📅 **Appointment Booking**: Patients can book appointments with doctors
- 🧪 **Lab Results**: View test results and medical reports (with XSS vulnerabilities)
- 💊 **Prescriptions**: View prescribed medications and instructions
- 💬 **Messaging**: Send messages to healthcare providers (vulnerable to XSS)

### Staff Dashboard
- 👨‍⚕️ **Doctor Features**:
  - View patient list and information
  - Manage appointments
  - Create and view lab results
  - Write prescriptions
  - Respond to patient messages

- 💊 **Pharmacist Features**:
  - View all prescriptions
  - Mark prescriptions as collected
  - Send messages to patients

### Role-Based Access
- Automatic dashboard routing based on user role (patient, doctor, pharmacist)
- Different functionality available to each role
- Deliberately weak access controls for educational purposes

## Security Vulnerabilities (Deliberately Vulnerable)

- 🔓 Weak authentication and authorization
- 🕵️‍♂️ Insecure direct object references
- ⚠️ Cross-site scripting (XSS) vulnerabilities
- 📂 Unrestricted file uploads
- 📡 Missing security headers
- 🔑 Weak session management
- 💉 SQL injection vulnerabilities
- 🔍 Information disclosure
- 🔐 Weak encryption
- 📝 Insecure deserialization

## Getting Started

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js (v14 or higher) and PostgreSQL

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zero-health.git
cd zero-health
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Test Accounts

The application comes with pre-configured test accounts:

- **Doctor**: `doctor@test.com` / `test123`
- **Pharmacist**: `pharmacist@test.com` / `test123`
- **Patients**: `patient1@test.com`, `patient2@test.com`, `patient3@test.com` / `test123`

### Manual Installation

1. Install server dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Set up the database:
```bash
# Create a PostgreSQL database named 'zero_health'
# Default credentials are intentionally weak for demonstration
```

4. Start the development servers:
```bash
# In the root directory
npm run dev:full
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/logout` - User logout

### Patient Portal
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/lab-results` - Get lab results
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/doctors` - Get list of doctors

### Staff Dashboard
- `GET /api/patients` - Get patient list (doctors only)
- `POST /api/lab-results` - Create lab result (doctors only)
- `POST /api/prescriptions` - Write prescription (doctors only)
- `PUT /api/prescriptions/:id/collect` - Mark prescription as collected (pharmacists only)

### Debug (Deliberately Exposed)
- `GET /api/debug/connection` - Database connection info
- `GET /api/health` - Application health status

## Security Vulnerabilities

This application contains numerous deliberate security vulnerabilities for educational purposes. Some examples include:

- Weak password hashing (only 5 bcrypt rounds)
- SQL injection vulnerabilities in multiple endpoints
- Cross-site scripting (XSS) in messages and lab results
- Insecure direct object references
- Missing security headers
- Weak JWT secrets and configuration
- Information disclosure through debug endpoints
- No input validation or sanitization
- And many more...

## Learning Objectives

By studying and exploiting the vulnerabilities in this application, you can learn:

1. How to identify common security vulnerabilities
2. The impact of these vulnerabilities
3. How to exploit them (for educational purposes)
4. Best practices for preventing them
5. Secure coding principles
6. Healthcare-specific security considerations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is intentionally vulnerable and should only be used in a controlled environment for educational purposes. Do not use it in production or with real data. The authors are not responsible for any misuse or damage caused by this application. 