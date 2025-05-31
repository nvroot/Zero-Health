# Zero Health Mobile App - Development Plan

## 📱 Tech Stack Decision: React Native

### Why React Native?
- **Code Reuse**: Leverage existing React components and API integration
- **Learning Continuity**: Same tech stack as web app (React/JavaScript/Node.js)
- **Vulnerability Ecosystem**: Rich npm ecosystem for demonstrating supply chain issues
- **Cross-Platform**: Single codebase for iOS and Android
- **Educational Value**: Shows how web vulnerabilities translate to mobile

## 🎯 OWASP Mobile Top 10 2024 Implementation

### M1: Improper Credential Usage
**Implementation Ideas:**
- Store JWT tokens in AsyncStorage (unencrypted)
- Hardcode API keys in JavaScript bundle
- Use weak biometric authentication bypass
- Store passwords in plain text locally
- No credential rotation or expiration

**Code Examples:**
```javascript
// Bad: Storing sensitive data in AsyncStorage
AsyncStorage.setItem('jwt_token', token);
AsyncStorage.setItem('user_password', password);

// Bad: Hardcoded credentials
const API_KEY = 'sk-1234567890abcdef';
const SECRET_KEY = 'zero-health-secret';
```

### M2: Inadequate Supply Chain Security
**Implementation Ideas:**
- Include vulnerable npm packages
- Use outdated React Native version
- Include malicious-looking dependencies
- No dependency scanning or SBOMs
- Use packages with known CVEs

**Vulnerable Dependencies to Include:**
```json
{
  "lodash": "4.17.20",      // Known prototype pollution
  "moment": "2.24.0",       // ReDoS vulnerabilities
  "axios": "0.18.0",        // Known security issues
  "react-native-keychain": "6.2.0"  // Older version
}
```

### M3: Insecure Authentication/Authorization
**Implementation Ideas:**
- No session timeout
- Weak password requirements (3 chars minimum)
- No account lockout after failed attempts
- Client-side role validation only
- JWT stored in plain text

**Code Examples:**
```javascript
// Bad: Client-side role checking only
if (user.role === 'admin') {
  showAdminFeatures();
}

// Bad: No session management
const isLoggedIn = AsyncStorage.getItem('isLoggedIn') === 'true';
```

### M4: Insufficient Input/Output Validation
**Implementation Ideas:**
- No input sanitization for API calls
- Direct SQL injection via mobile app
- XSS in WebView components
- No file upload restrictions
- Buffer overflow in native modules

**Code Examples:**
```javascript
// Bad: No input validation
const searchPatients = (query) => {
  fetch(`/api/patients?search=${query}`); // Direct injection
};

// Bad: Dangerous WebView usage
<WebView source={{html: userGeneratedContent}} />
```

### M5: Insecure Communication
**Implementation Ideas:**
- HTTP instead of HTTPS for sensitive data
- Weak TLS configuration
- Certificate pinning bypass
- Man-in-the-middle vulnerabilities
- Sensitive data in URL parameters

**Code Examples:**
```javascript
// Bad: HTTP for sensitive operations
const API_BASE = 'http://zero-health-api.com';

// Bad: Disable certificate validation
const agent = new https.Agent({
  rejectUnauthorized: false
});
```

### M6: Inadequate Privacy Controls
**Implementation Ideas:**
- Excessive permissions requests
- Location tracking without consent
- Contact access for "enhanced features"
- Analytics collection without disclosure
- Medical data shared with third parties

**Permissions Example:**
```xml
<!-- Excessive permissions -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
```

### M7: Insufficient Binary Protections
**Implementation Ideas:**
- No code obfuscation
- Debug builds in "production"
- Root/jailbreak detection bypass
- Anti-tampering disabled
- Source maps included in release

**React Native Specific:**
```javascript
// Bad: Debug code in production
if (__DEV__) {
  console.log('Debug mode - but this runs in production too!');
  // Expose debug features
}
```

### M8: Security Misconfiguration
**Implementation Ideas:**
- Default React Native configurations
- Expo development mode in production
- Debug features enabled
- Unnecessary services running
- Weak build configurations

**Metro Config Issues:**
```javascript
// Bad: Debug features enabled
module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx']
  },
  transformer: {
    minifierConfig: {
      keep_fnames: true,  // Keeps function names
      mangle: false       // No code mangling
    }
  }
};
```

### M9: Insecure Data Storage
**Implementation Ideas:**
- Medical records in AsyncStorage
- SQLite databases unencrypted
- Logs containing sensitive data
- Screenshots with patient data
- Cache containing PII

**Code Examples:**
```javascript
// Bad: Storing sensitive data insecurely
AsyncStorage.setItem('patient_records', JSON.stringify(records));
AsyncStorage.setItem('medical_history', patientData);

// Bad: Logging sensitive information
console.log('Patient SSN:', patient.ssn);
console.log('Medical records:', records);
```

### M10: Insufficient Cryptography
**Implementation Ideas:**
- Weak encryption algorithms (MD5, SHA1)
- Hardcoded encryption keys
- Custom crypto implementations
- No key management
- Predictable random number generation

**Code Examples:**
```javascript
// Bad: Weak crypto
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.DES.encrypt(data, 'fixed-key');

// Bad: Hardcoded keys
const ENCRYPTION_KEY = '1234567890123456';
```

## 🏗️ App Architecture

### Core Features (Mirroring Web App)
1. **Patient Portal**
   - View medical records
   - Book appointments
   - View lab results
   - Prescription management
   - Secure messaging

2. **Healthcare Provider Interface**
   - Patient management
   - Appointment scheduling
   - Lab result entry
   - Prescription writing

3. **AI Chatbot**
   - Role-based medical assistance
   - Voice input/output
   - Image analysis (fake AI features)

### Mobile-Specific Features
1. **Biometric Authentication** (vulnerable)
2. **Camera Integration** for "document scanning"
3. **Location Services** for "nearby doctors"
4. **Push Notifications** (with sensitive data)
5. **Offline Data Sync** (insecure)

## 📁 Project Structure

```
zero-health-mobile/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── patient/
│   │   └── provider/
│   ├── screens/
│   │   ├── auth/
│   │   ├── patient/
│   │   └── provider/
│   ├── navigation/
│   ├── services/
│   │   ├── api/
│   │   ├── storage/       # Vulnerable storage implementations
│   │   ├── crypto/        # Weak cryptography
│   │   └── auth/          # Insecure authentication
│   ├── vulnerabilities/   # Educational vulnerability showcase
│   └── utils/
├── android/
├── ios/
├── docs/
│   ├── vulnerabilities.md
│   └── exploitation-guide.md
└── package.json
```

## 🔧 Development Phases

### Phase 1: Foundation (Week 1-2)
- Set up React Native project
- Basic navigation and UI components
- API integration with existing backend
- Basic authentication flow

### Phase 2: Core Features (Week 3-4)
- Patient portal features
- Provider interface
- Basic chatbot integration
- File upload/download

### Phase 3: Vulnerability Implementation (Week 5-6)
- Implement all OWASP Mobile Top 10 vulnerabilities
- Add mobile-specific attack vectors
- Create exploitation documentation
- Add vulnerability showcase screen

### Phase 4: Polish & Documentation (Week 7-8)
- UI/UX improvements
- Comprehensive documentation
- Video tutorials
- Testing and bug fixes

## 🎨 UI/UX Considerations

### Design Principles
- **Professional Appearance**: Hide vulnerabilities behind polished UI
- **Healthcare Branding**: Consistent with web app
- **Accessibility**: Standard mobile accessibility patterns
- **Trust Indicators**: Security badges, certifications (fake but convincing)

### Vulnerable UI Patterns
- Trust dialogs that can be bypassed
- Fake security indicators
- Misleading permission requests
- Hidden debug menus
- Accessible developer options

## 📊 Educational Value

### Learning Objectives
1. **Mobile Security Fundamentals**
2. **Platform-Specific Vulnerabilities**
3. **Mobile DevSecOps**
4. **Penetration Testing Mobile Apps**
5. **Secure Mobile Development**

### Exploitation Scenarios
- Static analysis with tools like MobSF
- Dynamic analysis with Frida
- Network traffic analysis
- Binary reverse engineering
- Runtime manipulation

## 🔨 Tools & Dependencies

### Core Dependencies
```json
{
  "react-native": "0.72.0",
  "react-navigation": "^6.0.0",
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-native-keychain": "8.1.0",
  "react-native-sqlite-storage": "^6.0.1",
  "react-native-vector-icons": "^10.0.0",
  "axios": "^1.4.0",
  "react-native-paper": "^5.8.0"
}
```

### Vulnerable Dependencies (Intentional)
```json
{
  "lodash": "4.17.20",
  "moment": "2.24.0", 
  "crypto-js": "^4.1.1",
  "react-native-webview": "^11.0.0"
}
```

### Development Tools
- **React Native CLI**
- **Flipper** for debugging
- **MobSF** for security analysis
- **Frida** for runtime manipulation
- **Burp Suite** for traffic analysis

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio / Xcode
- Java 11+ / Android SDK

### Quick Start
```bash
# Clone and setup
git clone https://github.com/yourusername/zero-health-mobile.git
cd zero-health-mobile
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## 📚 Documentation Plan

### User Guides
- Installation and setup
- Basic usage and navigation
- Role-based feature overview

### Security Guides
- Vulnerability exploitation tutorials
- Mobile penetration testing guide
- Remediation recommendations
- Secure development practices

### Developer Guides
- Contributing guidelines
- Adding new vulnerabilities
- Testing procedures
- Deployment considerations 