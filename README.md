# Zero Health - Deliberately Vulnerable Healthcare Portal with AI Assistant

⚠️ **WARNING: This is a deliberately vulnerable application for educational purposes only. Do not use in production or with real data.**

## Purpose

Zero Health is a deliberately vulnerable healthcare portal designed to demonstrate common security vulnerabilities in web applications, now enhanced with an AI-powered chatbot system. It serves as an educational tool to help developers understand:

- Common web security vulnerabilities
- How these vulnerabilities can be exploited
- AI/LLM integration security risks and prompt injection vulnerabilities
- Best practices for preventing such vulnerabilities
- The importance of secure coding practices

## Application Features

### 🤖 AI-Powered Chatbot (NEW)
- **LLM Integration**: Powered by OpenAI GPT-4o-mini for intelligent responses
- **Two-Step Architecture**: Intent classification → Action execution
- **Database Operations**: Real-time SQL query generation and execution by AI
- **Conversation Memory**: Persistent chat history across sessions
- **Knowledge Base**: Comprehensive medical information and Zero Health services
- **Deliberate Vulnerabilities**: SQL injection, prompt injection, and information disclosure

### Patient Portal
- 📅 **Appointment Booking**: Patients can book appointments with doctors (AI-assisted)
- 🧪 **Lab Results**: View test results and medical reports (with XSS vulnerabilities)
- 💊 **Prescriptions**: View prescribed medications and instructions (AI-retrievable)
- 💬 **Messaging**: Send messages to healthcare providers (vulnerable to XSS)
- 🤖 **AI Assistant**: Chat with AI for health questions and portal assistance

### Staff Dashboard
- 👨‍⚕️ **Doctor Features**:
  - View patient list and information
  - Manage appointments (AI-accessible)
  - Create and view lab results
  - Write prescriptions
  - Respond to patient messages
  - AI-powered patient data retrieval

- 💊 **Pharmacist Features**:
  - View all prescriptions
  - Mark prescriptions as collected
  - Send messages to patients

### Role-Based Access
- Automatic dashboard routing based on user role (patient, doctor, pharmacist, admin)
- Different functionality available to each role
- Deliberately weak access controls for educational purposes
- AI respects (weak) role-based permissions

## 🔧 Technical Architecture

### Database Schema
- **Single Users Table**: All user types with role-based differentiation
- **Comprehensive Medical Records**: Appointments, prescriptions, lab results, messages
- **Chat History**: Persistent conversation storage for AI context
- **Deliberate Vulnerabilities**: Weak constraints, exposed schemas, SQL injection points

### AI System Architecture
```
User Message → Intent Classifier (LLM) → Action Handler (LLM) → SQL Execution → Response
```

- **Intent Classification**: Distinguishes between conversation and action requests
- **Schema-Aware**: AI has full database schema knowledge from init.sql
- **Conservative Classification**: Only executes actions on explicit user requests
- **Educational Vulnerabilities**: Maintains SQL injection and prompt injection risks

## Security Vulnerabilities (Deliberately Vulnerable)

### Traditional Web Vulnerabilities
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

### AI/LLM Specific Vulnerabilities (NEW)
- 🤖 **Prompt Injection**: AI can be manipulated through crafted prompts
- 🗄️ **SQL Injection via AI**: LLM generates vulnerable SQL queries
- 📊 **Information Disclosure**: AI exposes database schema and internal information
- 🔍 **Weak Access Controls**: AI bypasses intended data restrictions
- 💬 **Conversation Manipulation**: Chat history can be exploited for context injection
- 🎯 **Intent Classification Bypass**: Potential to trick action/conversation classification

## Getting Started

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js (v16 or higher) and PostgreSQL
- **OpenAI API Key** (required for chatbot functionality)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zero-health.git
cd zero-health
```

2. Set up environment variables:
```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

3. Start the application:
```bash
docker-compose up --build
```

4. **Automatic Sample Data Initialization** 🆕:
   - Sample data is automatically initialized on first startup
   - No manual steps required - users, medical records, and chat history are added automatically
   - Safe to restart containers - existing data is preserved

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Chatbot: Available as floating widget on all pages

### Sample Data Management 🆕

#### Automatic Initialization
- **First Run**: Sample data is automatically created when containers start
- **Database Detection**: System checks if data exists and skips if already present
- **Schema Auto-Setup**: Database tables are created automatically if missing
- **Idempotent**: Safe to run multiple times without duplicating data

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
- **Users**: Patient, doctors with specializations, admin accounts
- **Medical Records**: Annual physical exam with detailed notes
- **Prescriptions**: 4 realistic medications with dosages and instructions
- **Lab Results**: 6 common lab tests with realistic values
- **Chat History**: Previous AI conversations for testing continuity
- **Appointments**: Pre-scheduled appointments for testing

### Test Accounts

The application comes with pre-configured test accounts:

- **Admin**: `admin@zerohealth.com` / `admin123`
- **Doctor**: `doctor@test.com` / `password123`
- **Patient**: `patient@test.com` / `password123`

Additional doctors with specializations:
- **Cardiologist**: `dr.smith@zerohealth.com` / `doctor123`
- **Orthopedist**: `dr.brown@zerohealth.com` / `doctor123`
- **Pediatrician**: `dr.davis@zerohealth.com` / `doctor123`
- **Dermatologist**: `dr.wilson@zerohealth.com` / `doctor123`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/logout` - User logout

### AI Chatbot (NEW)
- `POST /api/chatbot/chat` - Main chat endpoint with two-step LLM processing
- `GET /api/chatbot/history` - Retrieve chat history for conversation continuity
- `POST /api/chatbot/enhanced-chat` - Enhanced chat with prompt injection vectors
- `GET /api/chatbot/admin/llm-status` - LLM system information (admin only)

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

## 🤖 AI Chatbot Features

### Conversation Examples
- **Health Questions**: "What are the symptoms of diabetes?"
- **Service Information**: "How do I book an appointment?"
- **Medical Guidance**: "I have a headache, what should I do?"

### Action Examples (Database Operations)
- **Appointment Booking**: "Book me an appointment with a cardiologist"
- **Data Retrieval**: "Show me my prescriptions"
- **Medical Records**: "What are my recent lab results?"

### Knowledge Base Topics
- Medical conditions (diabetes, hypertension, fever, headaches, COVID-19)
- Zero Health services and FAQ
- Appointment booking and medical record access
- Emergency guidance and contact information

## Security Vulnerabilities

This application contains numerous deliberate security vulnerabilities for educational purposes:

### Traditional Web Security Issues
- Weak password hashing (only 5 bcrypt rounds)
- SQL injection vulnerabilities in multiple endpoints
- Cross-site scripting (XSS) in messages and lab results
- Insecure direct object references
- Missing security headers
- Weak JWT secrets and configuration
- Information disclosure through debug endpoints
- No input validation or sanitization

### AI-Specific Security Issues (NEW)
- **Prompt Injection Attacks**: Manipulate AI behavior through crafted messages
- **SQL Injection via LLM**: AI generates and executes malicious SQL queries
- **Schema Disclosure**: AI reveals complete database structure to users
- **Access Control Bypass**: Weak role-based restrictions in AI-generated queries
- **Context Manipulation**: Exploit conversation history for unauthorized access
- **Information Leakage**: AI exposes internal system information and error details

## Learning Objectives

By studying and exploiting the vulnerabilities in this application, you can learn:

### Traditional Security Topics
1. How to identify common web security vulnerabilities
2. The impact of these vulnerabilities
3. How to exploit them (for educational purposes)
4. Best practices for preventing them
5. Secure coding principles
6. Healthcare-specific security considerations

### AI/LLM Security Topics (NEW)
7. Prompt injection attack techniques and prevention
8. Secure AI integration practices
9. LLM-generated code security risks
10. AI system access control and data protection
11. Conversation context security and manipulation
12. AI transparency vs. security trade-offs

## 🚀 Recent Updates

- **LLM Integration**: Complete chatbot system with OpenAI GPT-4o-mini
- **Database Consolidation**: Single users table with role-based access
- **Conversation Persistence**: Chat history across browser sessions
- **Smart Intent Classification**: Conservative approach to action vs. conversation
- **Dynamic Schema Loading**: AI gets real-time database structure from init.sql
- **Enhanced UI**: Modern floating chat widget with typing indicators
- **Comprehensive Testing**: Multiple doctor specializations and realistic data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When adding new features, please maintain the educational vulnerability aspects.

## Environment Variables

```bash
# Required for AI chatbot functionality
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# Database configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=zero_health
POSTGRES_HOST=db
POSTGRES_PORT=5432

# JWT Configuration (deliberately weak)
JWT_SECRET=your-secret-key-here
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is intentionally vulnerable and should only be used in a controlled environment for educational purposes. Do not use it in production or with real data. The authors are not responsible for any misuse or damage caused by this application.

**Additional AI Disclaimer**: The AI chatbot system contains deliberate vulnerabilities including prompt injection and SQL injection vectors. These are included for educational purposes to demonstrate AI security risks. Do not deploy similar systems in production without proper security controls. 