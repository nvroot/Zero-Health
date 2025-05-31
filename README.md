# Zero Health - Deliberately Vulnerable Healthcare Portal with AI Assistant

⚠️ **WARNING: This is a deliberately vulnerable application for educational purposes only. Do not use in production or with real data.**

![image](https://github.com/user-attachments/assets/36873934-d7d5-49b5-b730-d6e71b8c8325)

## Purpose

Zero Health is a deliberately vulnerable healthcare portal designed to demonstrate common security vulnerabilities in web applications, now enhanced with an AI-powered chatbot system. It serves as an educational tool to help developers understand:

- Common web security vulnerabilities
- How these vulnerabilities can be exploited
- AI/LLM integration security risks and prompt injection vulnerabilities
- Best practices for preventing such vulnerabilities
- The importance of secure coding practices

## Application Features

### 🤖 Role-Based AI Chatbot System
- **LLM Integration**: Powered by any OpenAI-compatible provider (OpenAI, Groq, LM Studio, Ollama, etc.)
- **Flexible API Support**: Simply provide your API key and endpoint - no vendor lock-in
- **Role-Based Functionality**: Different capabilities for patients, doctors, pharmacists, and admins
- **Two-Step Architecture**: Intent classification → Action execution with role permissions
- **Database Operations**: Real-time SQL query generation and execution by AI
- **Conversation Memory**: Persistent chat history across sessions
- **Knowledge Base**: Comprehensive medical information and Zero Health services
- **Staff Record Access**: Role-specific data pulling and management capabilities
- **Deliberate Vulnerabilities**: SQL injection, prompt injection, and information disclosure

#### Patient Chatbot Features
- Health questions and medical guidance
- Appointment booking assistance
- Medical records access
- Quick suggestions: "Our Services", "Book Appointment", "My Medical Records"

#### Staff Chatbot Features
- **Doctors**: Access patient records, view appointments, check lab results, search patients
- **Pharmacists**: Manage prescriptions, search medications, handle collections
- **Admins**: System statistics, user management, find staff members
- **Quick suggestions tailored to each role**

### Patient Portal
- 📅 **Appointment Booking**: Patients can book appointments with doctors (AI-assisted)
- 🧪 **Lab Results**: View test results with SVG medical images (with XSS vulnerabilities)
- 💊 **Prescriptions**: View prescribed medications and instructions (AI-retrievable)
- 💬 **Messaging**: Send messages to healthcare providers (vulnerable to XSS)
- 🤖 **AI Assistant**: Role-specific chat with health questions and portal assistance

### Staff Dashboard
- **Modern UI**: Professional design with Zero Health color palette and gradients
- **Role-Based Access**: Automatic routing and different functionality per role
- **Enhanced Chatbot**: Staff-specific quick suggestions and capabilities

- 👨‍⚕️ **Doctor Features**:
  - View patient list and information
  - Manage appointments with modern calendar views
  - Create and view lab results with image support
  - Write prescriptions with smart forms
  - Respond to patient messages
  - AI-powered patient data retrieval and search

- 💊 **Pharmacist Features**:
  - View all prescriptions with advanced filtering
  - Mark prescriptions as collected
  - Search medications and patient records
  - AI-assisted prescription management

- 👨‍💼 **Admin Features**:
  - Complete user management system
  - System statistics and analytics
  - Role-based user creation and editing
  - AI-powered system insights

### Role-Based Access Control
- Automatic dashboard routing based on user role (patient, doctor, pharmacist, admin)
- Different functionality and UI components for each role
- Role-specific chatbot capabilities and permissions
- Deliberately weak access controls for educational purposes

## 🔧 Technical Architecture

### Database Schema
- **Single Users Table**: All user types with role-based differentiation
- **Comprehensive Medical Records**: Appointments, prescriptions, lab results, messages
- **Chat History**: Persistent conversation storage for AI context
- **SVG Medical Images**: Sample lab result visualizations
- **Deliberately Vulnerable**: Weak constraints, exposed schemas, SQL injection points

### AI System Architecture
```
User Message → Role Detection → Intent Classifier (LLM) → Action Handler (LLM) → SQL Execution → Response
```

- **Role-Based Prompts**: Different AI behavior based on user role (patient/staff)
- **Intent Classification**: Distinguishes between conversation and action requests
- **Permission-Based**: Role-specific data access and query generation

## Getting Started

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js (v16 or higher) and PostgreSQL
- **API Key from any OpenAI-compatible provider** (required for chatbot functionality)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zero-health.git
cd zero-health
```

2. **Choose your AI provider and set up environment variables:**

The application supports multiple AI providers - simply choose one and set the appropriate environment variables:

#### Option A: OpenAI (Default)
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
export OPENAI_MODEL="gpt-4o-mini"
export OPENAI_BASE_URL="https://api.openai.com/v1"
```

#### Option B: Local LLM with LM Studio
```bash
export OPENAI_API_KEY="lm-studio"
export OPENAI_MODEL="your-local-model-name"
export OPENAI_BASE_URL="http://localhost:1234/v1"
```

#### Option C: Groq (Fast inference)
```bash
export OPENAI_API_KEY="your-groq-api-key"
export OPENAI_MODEL="llama3-8b-8192"
export OPENAI_BASE_URL="https://api.groq.com/openai/v1"
```

#### Option D: Ollama (Local)
```bash
export OPENAI_API_KEY="ollama"
export OPENAI_MODEL="llama3"
export OPENAI_BASE_URL="http://localhost:11434/v1"
```

#### Option E: Any OpenAI-Compatible Provider
```bash
export OPENAI_API_KEY="your-provider-api-key"
export OPENAI_MODEL="provider-specific-model-name"
export OPENAI_BASE_URL="https://your-provider-endpoint/v1"
```

3. Start the application:
```bash
docker-compose up --build
```

4. Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Chatbot**: Available as floating widget on all pages with role-specific functionality
- **API Documentation**: http://localhost:5000/api/docs (Interactive Swagger UI)
- **OpenAPI Spec**: http://localhost:5000/api/openapi.json (Raw JSON specification)

### Sample Data Management

#### Automatic Initialization
- **First Run**: Sample data is automatically created when containers start
- **Database Detection**: System checks if data exists and skips if already present
- **Schema Auto-Setup**: Database tables are created automatically if missing
- **Idempotent**: Safe to run multiple times without duplicating data
- **Image Generation**: Creates sample SVG medical images for lab results

#### Manual Database Reset
Reset the entire database and get fresh sample data:
```bash
# Interactive reset script
./scripts/reset-database.sh

# This will:
# - Stop all containers and remove volumes
# - Remove sample data markers
# - Rebuild containers from scratch
# - Automatically reinitialize fresh sample data
```

#### Sample Data Components
- **Users**: Patients, doctors with specializations, pharmacists, admin accounts
- **Medical Records**: Realistic medical records with detailed notes
- **Prescriptions**: Multiple medications with dosages and instructions
- **Lab Results**: Common lab tests with realistic values and SVG images
- **Appointments**: Pre-scheduled appointments for testing
- **Chat History**: Previous AI conversations for testing continuity
- **SVG Medical Images**: Blood tests, X-rays, MRI scans for lab results

### Test Accounts

The application comes with pre-configured test accounts:

#### Primary Test Accounts
- **Admin**: `admin@zerohealth.com` / `password123` (Admin User)
- **Doctor**: `doctor@test.com` / `password123` (Dr. Kendrick Lawal) 
- **Patient**: `patient@test.com` / `password123` (Samuel L Jackson)

#### Additional Staff Accounts
**Doctors with specializations:**
- **Dr. Marshall D. Teach**: `dr.teach@zerohealth.com` / `password123`
- **Dr. Erwin Smith**: `dr.smith@zerohealth.com` / `password123`
- **Dr. Tinu Buhari**: `dr.buhari@zerohealth.com` / `password123`
- **Dr. Acule Mihawk**: `dr.mihawk@zerohealth.com` / `password123`

**Pharmacist accounts:**
- **Ugo C Shege**: `ugocshege@zerohealth.com` / `password123`
- **Pablo Escrowbar**: `escrowbar@zerohealth.com` / `password123`

### Role-Based Dashboard Access

Each role automatically routes to their appropriate dashboard:

- **Patients** → Patient Portal with personal health data
- **Doctors** → Staff Dashboard with patient management tools
- **Pharmacists** → Staff Dashboard with prescription management
- **Admins** → Staff Dashboard with system administration tools

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login with role-based routing
- `GET /api/logout` - User logout

### AI Chatbot (ROLE-BASED)
- `POST /api/chatbot/chat` - Main chat endpoint with role-specific processing
- `GET /api/chatbot/history` - Retrieve chat history for conversation continuity
- `POST /api/chatbot/enhanced-chat` - Enhanced chat with prompt injection vectors
- `GET /api/chatbot/admin/llm-status` - LLM system information (admin only)

### Patient Portal
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/lab-results` - Get lab results with SVG images
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/doctors` - Get list of doctors

### Staff Dashboard
- `GET /api/patients` - Get patient list (doctors only)
- `POST /api/lab-results` - Create lab result with image upload (doctors only)
- `POST /api/prescriptions` - Write prescription (doctors only)
- `PUT /api/prescriptions/:id/collect` - Mark prescription as collected (pharmacists only)
- `GET /api/admin/users` - Get all users (admins only)
- `POST /api/admin/users` - Create new user (admins only)
- `DELETE /api/admin/users/:id` - Delete user (admins only)
- `PUT /api/admin/users/:id/role` - Update user role (admins only)
- `GET /api/admin/statistics` - Get system statistics (admins only)

### Debug (Deliberately Exposed)
- `GET /api/debug/connection` - Database connection info
- `GET /api/health` - Application health status

## 🤖 AI Chatbot Features

### Role-Specific Capabilities

#### Patient Chatbot
- **Health Questions**: "What are the symptoms of diabetes?"
- **Service Information**: "How do I book an appointment?"
- **Medical Records**: "Show my lab results"
- **Appointment Booking**: "Book me an appointment with a cardiologist"

#### Doctor Chatbot
- **Patient Search**: "Find patient John Doe"
- **Appointment Management**: "Show my appointments today"
- **Lab Results**: "Show pending lab results"
- **Patient Records**: "Show all my patients"

#### Pharmacist Chatbot
- **Prescription Management**: "Show pending prescriptions"
- **Medication Search**: "Find prescriptions for Lisinopril"
- **Collection Tracking**: "Show collected prescriptions today"

#### Admin Chatbot
- **System Statistics**: "Show system statistics"
- **User Management**: "Show all users"
- **Staff Search**: "Find doctors"

### Knowledge Base Topics
- Medical conditions (diabetes, hypertension, fever, headaches, COVID-19)
- Zero Health services and FAQ
- Appointment booking and medical record access
- Emergency guidance and contact information
- Role-specific operational guidance

## Security Vulnerabilities

This application contains numerous deliberate security vulnerabilities for educational purposes:

### Web Security Issues
- Weak password hashing (only 5 bcrypt rounds)
- SQL injection vulnerabilities in multiple endpoints
- Cross-site scripting (XSS) in messages and lab results
- Insecure direct object references
- Weak JWT secrets and configuration
- Information disclosure through debug endpoints
- No input validation or sanitization

### AI-Specific Security Issues
- **Prompt Injection Attacks**: Manipulate AI behavior through crafted messages
- **SQL Injection via LLM**: AI generates and executes malicious SQL queries
- **Schema Disclosure**: AI reveals complete database structure to users
- **Role-Based Access Bypass**: Weak restrictions in AI-generated queries
- **Context Manipulation**: Exploit conversation history for unauthorized access
- **Information Leakage**: AI exposes internal system information and error details
- **Cross-Role Data Access**: Potential to access data beyond assigned role

### UI/UX Security Issues
- **XSS in Styled Content**: Dangerous HTML rendering in formatted messages
- **CSS Injection**: Potential style manipulation vulnerabilities
- **Client-Side Role Detection**: Weak role-based UI rendering

## Learning Objectives

By studying and exploiting the vulnerabilities in this application, you can learn:

### Traditional Security Topics
1. How to identify common web security vulnerabilities
2. The impact of these vulnerabilities
3. How to exploit them (for educational purposes)
4. Best practices for preventing them
5. Secure coding principles
6. Healthcare-specific security considerations

### AI/LLM Security Topics
7. Prompt injection attack techniques and prevention
8. Secure AI integration practices
9. LLM-generated code security risks
10. AI system access control and data protection
11. Role-based AI security and permission models
12. Conversation context security and manipulation
13. AI transparency vs. security trade-offs

### Modern UI Security
14. Client-side security considerations
15. XSS prevention in modern web applications
16. Secure styling and CSS practices
17. Role-based UI security patterns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When adding new features, please maintain the educational vulnerability aspects and modern UI standards.

### Development Guidelines
- Follow the Zero Health brand color system using CSS custom properties
- Maintain role-based functionality separation
- Preserve intentional vulnerabilities for educational purposes
- Document new security issues in the README

## Environment Variables

### AI Provider Configuration (Choose One)

The application works with any OpenAI-compatible API provider. Simply set these three variables based on your chosen provider:

```bash
# Required for AI chatbot functionality - works with multiple providers
OPENAI_API_KEY=your-api-key-here          # Your provider's API key
OPENAI_MODEL=your-model-name              # Model name (e.g., gpt-4o-mini, llama3-8b-8192, etc.)
OPENAI_BASE_URL=https://api.provider.com/v1  # Provider's API endpoint

# Examples for popular providers:
# OpenAI: https://api.openai.com/v1
# Groq: https://api.groq.com/openai/v1  
# Local LM Studio: http://localhost:1234/v1
# Local Ollama: http://localhost:11434/v1
```

### Database Configuration
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zero_health
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

### Security Configuration (Deliberately Weak)
```bash
# JWT Configuration (deliberately weak for educational purposes)
JWT_SECRET=your-secret-key-here
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is intentionally vulnerable and should only be used in a controlled environment for educational purposes. Do not use it in production or with real data. The authors are not responsible for any misuse or damage caused by this application.

**Additional AI Disclaimer**: The AI chatbot system contains deliberate vulnerabilities including prompt injection and SQL injection vectors. These are included for educational purposes to demonstrate AI security risks. Do not deploy similar systems in production without proper security controls.

**UI/UX Disclaimer**: The modern design and professional appearance are intentional to demonstrate how attractive interfaces can mask serious security vulnerabilities.
