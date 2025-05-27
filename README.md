# Zero Health - Deliberately Vulnerable Healthcare Portal

⚠️ **WARNING: This is a deliberately vulnerable application for educational purposes only. Do not use in production or with real data.**

## Purpose

Zero Health is a deliberately vulnerable healthcare portal designed to demonstrate common security vulnerabilities in web applications. It serves as an educational tool to help developers understand:

- Common web security vulnerabilities
- How these vulnerabilities can be exploited
- Best practices for preventing such vulnerabilities
- The importance of secure coding practices

## Features (Deliberately Vulnerable)

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

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zero-health.git
cd zero-health
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
```

4. Set up the database:
```bash
# Create a PostgreSQL database named 'zero_health'
# Default credentials are intentionally weak for demonstration
```

5. Start the development servers:
```bash
# In the root directory
npm run dev:full
```

## Security Vulnerabilities

This application contains numerous deliberate security vulnerabilities for educational purposes. Some examples include:

- Weak password hashing
- SQL injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure file uploads
- Missing security headers
- Weak session management
- Information disclosure
- And many more...

## Learning Objectives

By studying and exploiting the vulnerabilities in this application, you can learn:

1. How to identify common security vulnerabilities
2. The impact of these vulnerabilities
3. How to exploit them (for educational purposes)
4. Best practices for preventing them
5. Secure coding principles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is intentionally vulnerable and should only be used in a controlled environment for educational purposes. Do not use it in production or with real data. The authors are not responsible for any misuse or damage caused by this application. 