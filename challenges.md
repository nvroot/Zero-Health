# Zero Health Security Challenges

Welcome to the Zero Health Security Challenge Platform! This document contains hands-on security challenges designed to help you learn about healthcare application security vulnerabilities in a safe, controlled environment.

⚠️ **IMPORTANT**: These challenges are for educational purposes only. Never attempt these techniques on systems you don't own or without explicit permission.

## 🎯 Challenge Categories

### 🟢 **Beginner Level**
Perfect for those new to web application security

### 🟡 **Intermediate Level** 
For those with basic security knowledge looking to advance

### 🔴 **Advanced Level**
Complex multi-step attacks requiring deep technical knowledge

---

## 🟢 BEGINNER CHALLENGES

### Challenge 1: Reflected Cross-Site Scripting (XSS)
**Difficulty**: 🟢 Beginner  
**Category**: Web Application Security

**Description**: 
The password reset functionality contains a reflected XSS vulnerability where user input from URL parameters is directly embedded into the React component without proper sanitization. The vulnerability exists in the React component's use of `dangerouslySetInnerHTML` to display the reset code parameter.

**Goal**: 
Execute JavaScript code in another user's browser through the password reset functionality.

**Learning Objectives**:
- Understand how reflected XSS vulnerabilities work in React applications
- Learn about the dangers of `dangerouslySetInnerHTML` in React
- Practice crafting XSS payloads for modern web applications
- See how client-side routing can still be vulnerable to XSS

**Hints**:
- The vulnerability is in the React component at `/reset-password`
- Look at how the `code` parameter from the URL is handled and displayed
- The React component uses `dangerouslySetInnerHTML` to render the reset code
- Try crafting a malicious reset URL like: `http://localhost:3000/reset-password?code=<script>alert('XSS')</script>&email=test@example.com`
- Consider how an attacker might craft a malicious reset link to send to victims via email

**Success Criteria**:
- Successfully execute JavaScript in the browser context
- Demonstrate how this could be used in a real attack scenario

---

### Challenge 2: SQL Injection - Authentication Bypass
**Difficulty**: Beginner  
**Category**: SQL Injection  
**Goal**: Bypass the login system using SQL injection to access any user account without knowing their password.

**Description**: The login system is vulnerable to SQL injection attacks. Use this vulnerability to log in as any user without knowing their credentials.

**What you'll learn**:
- Basic SQL injection techniques
- How authentication systems can be bypassed
- The importance of parameterized queries

**Hint**: Try manipulating the email field in the login form. Think about how SQL queries work and how you might make the WHERE clause always return true.

---

### Challenge 3: Insecure Direct Object References (IDOR)
**Difficulty**: Beginner  
**Category**: Broken Access Control  
**Goal**: Access lab results that don't belong to you by manipulating object references.

**Description**: The application uses predictable IDs to reference lab results. Exploit this to view other patients' medical data.

**What you'll learn**:
- How IDOR vulnerabilities work
- The importance of proper authorization checks
- Why predictable IDs are dangerous

**Hint**: After viewing your own lab results, look at the URL structure. Try changing the ID parameter to access other records.

---

### Challenge 4: Reflected XSS
**Difficulty**: Beginner  
**Category**: Cross-Site Scripting  
**Goal**: Execute JavaScript code in another user's browser through the search functionality.

**Description**: The search feature reflects user input without proper sanitization. Craft a malicious search query that executes JavaScript when viewed.

**What you'll learn**:
- How reflected XSS attacks work
- The difference between reflected and stored XSS
- Basic XSS payload construction

**Hint**: Use the search functionality and try including HTML/JavaScript tags in your search query. Look for where your input gets reflected in the response.

---

### Challenge 5: File Upload Bypass
**Difficulty**: Beginner  
**Category**: File Upload Vulnerabilities  
**Goal**: Upload a file type that should be blocked by the security filters.

**Description**: The file upload system has weak filtering that can be bypassed. Upload a potentially dangerous file type despite the restrictions.

**What you'll learn**:
- Common file upload filter bypasses
- Why file type validation is important
- Different methods of file type detection

**Hint**: The system only blocks certain obvious file extensions. Try using different extensions or techniques to bypass the filter.

---

## 🟡 INTERMEDIATE CHALLENGES

### Challenge 6: Stored XSS via Patient Feedback
**Difficulty**: Intermediate  
**Category**: Cross-Site Scripting  
**Goal**: Execute JavaScript in a doctor's browser by injecting malicious code through patient appointment feedback.

**Description**: Patients can leave feedback on appointments that doctors will view. This feedback is stored without proper sanitization, creating a stored XSS vulnerability. Craft a payload that will execute when a doctor views the appointment.

**What you'll learn**:
- How stored XSS differs from reflected XSS
- The impact of XSS in healthcare applications
- Advanced XSS payload techniques

**Hint**: Look for appointment feedback functionality. Your payload needs to survive database storage and execute when rendered in the doctor's interface.

---

### Challenge 7: JWT Token Manipulation
**Difficulty**: Intermediate  
**Category**: Authentication & Authorization  
**Goal**: Escalate your privileges by manipulating JWT tokens to gain administrative access.

**Description**: The application uses JWT tokens for authentication, but the implementation has several weaknesses. Exploit these to gain higher privileges.

**What you'll learn**:
- JWT structure and vulnerabilities
- Algorithm confusion attacks
- Token manipulation techniques

**Hint**: Examine the JWT token structure and look for ways to modify it. Pay attention to the algorithm field and consider what happens if you change it.

---

### Challenge 8: SQL Injection via AI Chatbot
**Difficulty**: Intermediate  
**Category**: AI Security + SQL Injection  
**Goal**: Use the AI chatbot to execute arbitrary SQL queries and extract sensitive data from the database.

**Description**: The AI chatbot generates SQL queries based on user input, but lacks proper validation. Manipulate the AI to generate malicious SQL queries that extract unauthorized data.

**What you'll learn**:
- AI-specific security vulnerabilities
- How LLMs can be manipulated to generate malicious code
- The intersection of AI and traditional security vulnerabilities

**Hint**: Try asking the chatbot to perform database operations. The AI has some basic guardrails, but they can be bypassed with creative prompting.

---

### Challenge 9: Parameter Pollution
**Difficulty**: Intermediate  
**Category**: API Security  
**Goal**: Exploit parameter pollution vulnerabilities to access unauthorized user profiles.

**Description**: The API handles duplicate parameters inconsistently, allowing you to bypass access controls through parameter pollution attacks.

**What you'll learn**:
- How parameter pollution works
- API security best practices
- The importance of consistent parameter handling

**Hint**: Look for API endpoints that accept parameters. Try sending the same parameter multiple times with different values.

---

### Challenge 10: Rate Limiting Bypass
**Difficulty**: Intermediate  
**Category**: API Security  
**Goal**: Bypass rate limiting protections to perform brute force attacks.

**Description**: The application implements rate limiting, but it can be bypassed using various techniques. Exploit these weaknesses to perform unlimited login attempts.

**What you'll learn**:
- Common rate limiting implementations
- Techniques to bypass rate limiting
- The importance of proper rate limiting design

**Hint**: Rate limiting often relies on client identification. Consider how the system identifies you and whether that can be manipulated.

---

## 🔴 ADVANCED CHALLENGES

### Challenge 11: AI Prompt Injection with Data Exfiltration
**Difficulty**: Advanced  
**Category**: AI Security  
**Goal**: Bypass the AI's security guardrails and extract sensitive patient data from other users.

**Description**: The AI chatbot has security measures to prevent unauthorized data access, but these can be bypassed with sophisticated prompt injection techniques. Extract patient data you shouldn't have access to.

**What you'll learn**:
- Advanced prompt injection techniques
- AI security bypass methods
- The challenges of securing AI systems

**Hint**: The AI has instructions to protect patient data, but these instructions can be overridden. Try techniques like role-playing, instruction injection, or context manipulation.

---

### Challenge 12: XXE to Remote Code Execution
**Difficulty**: Advanced  
**Category**: XML External Entity (XXE)  
**Goal**: Achieve remote code execution through the XML medical history import feature.

**Description**: The medical history import feature processes XML files with dangerous configurations. Chain XXE vulnerabilities with other weaknesses to achieve remote code execution.

**What you'll learn**:
- XXE attack techniques
- Chaining vulnerabilities for maximum impact
- XML processing security

**Hint**: The XML parser allows external entities and has additional processing features that can be exploited. Look for ways to combine XXE with other vulnerabilities.

---

### Challenge 13: Command Injection via PDF Generation
**Difficulty**: Advanced  
**Category**: Command Injection  
**Goal**: Execute system commands through the PDF report generation feature.

**Description**: The PDF generation system uses user-controlled data in system commands. Exploit this to execute arbitrary commands on the server.

**What you'll learn**:
- Command injection techniques
- How user data can end up in system commands
- The dangers of dynamic command construction

**Hint**: Look at how patient names and other data are used in the PDF generation process. Consider how you might inject additional commands.

---

### Challenge 14: Mass Assignment to Admin Escalation
**Difficulty**: Advanced  
**Category**: Mass Assignment  
**Goal**: Escalate your privileges to administrator level by exploiting mass assignment vulnerabilities.

**Description**: The profile update functionality suffers from mass assignment vulnerabilities, allowing you to modify fields that should be restricted.

**What you'll learn**:
- Mass assignment attack techniques
- The importance of input validation
- How to properly handle user input in updates

**Hint**: When updating your profile, the system may accept more fields than intended. Explore what fields exist in the user model and try to modify restricted ones.

---

### Challenge 15: Multi-Stage Attack Chain
**Difficulty**: Advanced  
**Category**: Attack Chaining  
**Goal**: Combine multiple vulnerabilities to achieve complete system compromise.

**Description**: Use a combination of the vulnerabilities you've discovered to achieve maximum impact. This might involve information disclosure → privilege escalation → data exfiltration → persistence.

**What you'll learn**:
- How to chain multiple vulnerabilities
- Real-world attack methodologies
- The cumulative impact of security weaknesses

**Hint**: Start with information gathering, then use what you learn to find and exploit additional vulnerabilities. Each step should enable the next.

---

### Challenge 16: File Upload to RCE
**Difficulty**: Advanced  
**Category**: File Upload + RCE  
**Goal**: Achieve remote code execution through the advanced file upload system.

**Description**: The advanced file upload system has a dangerous execution feature. Exploit this to run arbitrary code on the server.

**What you'll learn**:
- Advanced file upload attack techniques
- How file uploads can lead to RCE
- Server-side execution vulnerabilities

**Hint**: Look for file upload endpoints that offer execution capabilities. Consider what file types can be executed and how to bypass restrictions.

---

## 🏆 BONUS CHALLENGES

### Challenge 17: Healthcare-Specific Attack
**Difficulty**: Variable  
**Category**: Healthcare Security  
**Goal**: Demonstrate a realistic attack scenario specific to healthcare applications.

**Description**: Healthcare applications have unique security requirements due to HIPAA and patient safety concerns. Design and execute an attack that demonstrates the specific risks in healthcare environments.

**What you'll learn**:
- Healthcare-specific security concerns
- HIPAA compliance implications
- The real-world impact of healthcare breaches

---

### Challenge 18: Zero-Day Discovery
**Difficulty**: Expert  
**Category**: Vulnerability Research  
**Goal**: Find a vulnerability not explicitly mentioned in this challenge list.

**Description**: Use your security knowledge to discover additional vulnerabilities in the Zero Health platform that aren't covered by the existing challenges.

**What you'll learn**:
- Vulnerability research methodologies
- How to think like an attacker
- The importance of comprehensive security testing

---

## 📚 Learning Resources

### Recommended Reading
- OWASP Top 10 Web Application Security Risks
- OWASP API Security Top 10
- NIST Cybersecurity Framework
- Healthcare Cybersecurity Best Practices

### Tools You Might Need
- Burp Suite or OWASP ZAP (Web Application Testing)
- Browser Developer Tools
- Command Line Tools (curl, etc.)
- Text Editor for payload crafting

### Getting Help
- Review the application's API documentation at `/api/docs`
- Use browser developer tools to inspect requests/responses
- Check server logs for error messages (they might contain hints)
- Remember: the goal is learning, not just completing challenges

---

## 🎓 Completion Guidelines

### For Each Challenge:
1. **Document your approach**: Write down the steps you took
2. **Explain the vulnerability**: Describe why the vulnerability exists
3. **Assess the impact**: What could an attacker do with this vulnerability?
4. **Suggest remediation**: How would you fix this vulnerability?

### Reporting Format:
```
Challenge: [Challenge Name]
Vulnerability Type: [Type]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
...

Impact: [Description of potential impact]
Remediation: [How to fix the vulnerability]
```

---

## ⚠️ Ethical Guidelines

- Only test against the Zero Health application
- Do not attempt these techniques on other systems
- Respect the learning environment
- Help others learn, but don't just give away answers
- Report any unintended system issues

---

## 🏥 Healthcare Security Context

Remember that in real healthcare environments:
- Patient data is highly sensitive and regulated
- System downtime can impact patient care
- Compliance requirements (HIPAA, HITECH) add additional security obligations
- The stakes are literally life and death

Understanding these challenges in the context of healthcare security will make you a more effective security professional in this critical industry.

---

**Happy Hacking! 🔐**

*Remember: The goal is to learn and improve security, not to cause harm.* 