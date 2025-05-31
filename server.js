const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// JWT secret configuration
const JWT_SECRET = 'zero-health-super-secret-key';

// CORS configuration
app.use(cors({
    origin: true,  // Allow any origin (deliberately insecure)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin', 'Cache-Control', 'X-File-Name'],  // Explicit headers for credentials mode
    exposedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count'],  // Explicit headers for credentials mode
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database configuration
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'zero_health',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

// The sample data script will handle all database initialization
// No need for duplicate schema creation here

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Very weak file filtering - allows most dangerous file types
        const blockedExtensions = ['.exe', '.bat', '.cmd']; // Only blocks obvious Windows executables
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        if (blockedExtensions.includes(fileExtension)) {
            cb(new Error('Executable files not allowed'), false);
        } else {
            cb(null, true); // Allow everything else including .php, .js, .html, .svg, etc.
        }
    }
});

// Deliberately weak JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('Token verification attempt:', token ? 'Token present' : 'No token');
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Deliberately weak: Accept unsigned tokens and multiple algorithms
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'none'] });
        } catch (verifyError) {
            // Fallback to decode without verification for "debug" tokens
            decoded = jwt.decode(token);
            if (!decoded || !decoded.id) {
                throw new Error('Invalid token structure');
            }
            console.log('Accepted unverified token for debugging:', decoded);
        }
        
        console.log('Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Add OPTIONS handlers for all API endpoints
app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin, Cache-Control, X-File-Name');
    res.status(204).end();
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account in the Zero Health system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 minLength: 3
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Authentication endpoints
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Deliberately weak password validation
        if (!password || password.length < 3) {
            return res.status(400).json({ error: 'Password must be at least 3 characters' });
        }

        // Weak password hashing (using only 5 rounds)
        const hashedPassword = await bcrypt.hash(password, 5);
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}') RETURNING id, email, role`
        );

        const user = result.rows[0];
        
        // Generate JWT token with weak settings
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { 
                expiresIn: '24h',  // Deliberately long expiration
                algorithm: 'HS256' // Weak algorithm
            }
        );

        res.status(201).json({ 
            user: user,
            token: token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user credentials and receive access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: patient@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // No rate limiting - vulnerable to brute force attacks
        console.log('Login attempt:', { email, password: password ? '[REDACTED]' : 'undefined' });

        // SQL injection vulnerable query
        const result = await pool.query(
            `SELECT * FROM users WHERE email = '${email}'`
        );

        console.log('User lookup result:', result.rows.length > 0 ? 'User found' : 'User not found');

        if (result.rows.length === 0) {
            console.log('Login failed: User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        console.log('Password validation:', validPassword ? 'Valid' : 'Invalid');

        if (!validPassword) {
            console.log('Login failed: Invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with weak settings
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { 
                expiresIn: '24h',  // Deliberately long expiration
                algorithm: 'HS256' // Weak algorithm
            }
        );
        
        console.log('Login successful, token generated for user:', user.id);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/logout', (req, res) => {
    // Note: With JWT, logout is handled client-side by removing the token
    res.json({ message: 'Logged out successfully. Please remove token from client.' });
});

// Medical records endpoints (now using JWT)
app.post('/api/medical-records', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        console.log('Creating medical record for user:', userId);

        // Use parameterized query to avoid SQL injection
        const result = await pool.query(
            `INSERT INTO medical_records (user_id, title, content) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [userId, title, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create medical record error:', error);
        res.status(500).json({ error: 'Failed to create medical record' });
    }
});

app.get('/api/medical-records', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('Fetching medical records for user:', userId);

        // Use parameterized query to avoid SQL injection
        const result = await pool.query(
            `SELECT mr.*, u.email as user_email 
             FROM medical_records mr 
             JOIN users u ON mr.user_id = u.id 
             WHERE mr.user_id = $1`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get medical records error:', error);
        res.status(500).json({ error: 'Failed to get medical records' });
    }
});

// ===== APPOINTMENT ENDPOINTS =====
app.get('/api/appointments', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let query;
        let params = [userId];
        
        if (userRole === 'patient') {
            query = `SELECT a.*, 
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM appointments a 
                     JOIN users d ON a.doctor_id = d.id 
                     WHERE a.patient_id = $1`;
        } else if (userRole === 'doctor') {
            query = `SELECT a.*, 
                           p.first_name as patient_first_name, p.last_name as patient_last_name
                     FROM appointments a 
                     JOIN users p ON a.patient_id = p.id 
                     WHERE a.doctor_id = $1`;
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ error: 'Failed to get appointments' });
    }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
    try {
        const { doctor_id, appointment_date, reason } = req.body;
        const patient_id = req.user.id;
        
        // Use parameterized query to avoid SQL injection
        const result = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [patient_id, doctor_id, appointment_date, reason]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.get('/api/doctors', verifyToken, async (req, res) => {
    try {
        // Excessive data exposure - returns sensitive fields like password hash, personal info
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, password, phone, date_of_birth, address, 
                    specialization, license_number, created_at 
             FROM users WHERE role = 'doctor'`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({ error: 'Failed to get doctors' });
    }
});

// ===== LAB RESULTS ENDPOINTS =====
app.get('/api/lab-results', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let query;
        let params = [];
        
        if (userRole === 'patient') {
            // Patients can only see their own results
            query = `SELECT lr.*, 
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM lab_results lr 
                     JOIN users d ON lr.doctor_id = d.id 
                     WHERE lr.patient_id = $1`;
            params = [userId];
        } else {
            // Staff can see all lab results (less restrictive)
            query = `SELECT lr.*, 
                           p.first_name as patient_first_name, p.last_name as patient_last_name,
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM lab_results lr 
                     JOIN users p ON lr.patient_id = p.id 
                     JOIN users d ON lr.doctor_id = d.id 
                     ORDER BY lr.test_date DESC`;
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get lab results error:', error);
        res.status(500).json({ error: 'Failed to get lab results' });
    }
});

app.post('/api/lab-results', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Doctor access required' });
        }
        
        const { patient_id, test_name, result_data, test_date } = req.body;
        const doctor_id = req.user.id;
        const file_path = req.file ? req.file.filename : null;
        
        // Use parameterized query to avoid SQL injection
        const result = await pool.query(
            `INSERT INTO lab_results (patient_id, doctor_id, test_name, result, test_date, file_path) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [patient_id, doctor_id, test_name, result_data, test_date, file_path]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create lab result error:', error);
        res.status(500).json({ error: 'Failed to create lab result' });
    }
});

// ===== VULNERABLE ENDPOINT - Direct lab result access (IDOR) =====
app.get('/api/lab-results/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // IDOR vulnerability - no check if user can access this lab result
        const result = await pool.query(
            `SELECT lr.*, 
                    p.first_name as patient_first_name, p.last_name as patient_last_name,
                    d.first_name as doctor_first_name, d.last_name as doctor_last_name
             FROM lab_results lr 
             JOIN users p ON lr.patient_id = p.id 
             JOIN users d ON lr.doctor_id = d.id 
             WHERE lr.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lab result not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get lab result error:', error);
        res.status(500).json({ error: 'Failed to get lab result' });
    }
});

// ===== PRESCRIPTION ENDPOINTS =====
app.get('/api/prescriptions', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let query;
        let params = [userId];
        
        if (userRole === 'patient') {
            query = `SELECT p.*, 
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM prescriptions p 
                     JOIN users d ON p.doctor_id = d.id 
                     WHERE p.patient_id = $1`;
        } else if (userRole === 'doctor') {
            query = `SELECT p.*, 
                           pt.first_name as patient_first_name, pt.last_name as patient_last_name
                     FROM prescriptions p 
                     JOIN users pt ON p.patient_id = pt.id 
                     WHERE p.doctor_id = $1`;
        } else if (userRole === 'pharmacist') {
            query = `SELECT p.*, 
                           pt.first_name as patient_first_name, pt.last_name as patient_last_name,
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM prescriptions p 
                     JOIN users pt ON p.patient_id = pt.id 
                     JOIN users d ON p.doctor_id = d.id`;
            params = [];
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get prescriptions error:', error);
        res.status(500).json({ error: 'Failed to get prescriptions' });
    }
});

app.post('/api/prescriptions', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Doctor access required' });
        }
        
        const { patient_id, medication_name, dosage, frequency, duration, instructions } = req.body;
        const doctor_id = req.user.id;
        
        // Use parameterized query to avoid SQL injection
        const result = await pool.query(
            `INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

app.put('/api/prescriptions/:id/collect', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'pharmacist') {
            return res.status(403).json({ error: 'Pharmacist access required' });
        }
        
        const { id } = req.params;
        
        // Use parameterized query
        const result = await pool.query(
            `UPDATE prescriptions SET status = 'collected', collected_date = CURRENT_DATE 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update prescription error:', error);
        res.status(500).json({ error: 'Failed to update prescription' });
    }
});

// ===== MESSAGE ENDPOINTS =====
app.get('/api/messages', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // SQL injection vulnerable query - get all messages for user
        const result = await pool.query(
            `SELECT m.*, 
                    s.first_name as sender_first_name, s.last_name as sender_last_name, s.role as sender_role,
                    r.first_name as recipient_first_name, r.last_name as recipient_last_name, r.role as recipient_role
             FROM messages m 
             JOIN users s ON m.sender_id = s.id 
             JOIN users r ON m.recipient_id = r.id 
             WHERE m.sender_id = '${userId}' OR m.recipient_id = '${userId}'
             ORDER BY m.created_at DESC`
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to get messages' });
    }
});

app.post('/api/messages', verifyToken, async (req, res) => {
    try {
        const { recipient_id, subject, content } = req.body;
        const sender_id = req.user.id;
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `INSERT INTO messages (sender_id, recipient_id, subject, content) 
             VALUES ('${sender_id}', '${recipient_id}', '${subject}', '${content}') 
             RETURNING *`
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

app.get('/api/patients', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Doctor access required' });
        }
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, phone, date_of_birth, gender FROM users WHERE role = 'patient'`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Failed to get patients' });
    }
});

// =======================
// CHATBOT ENDPOINTS - DELIBERATELY VULNERABLE
// =======================

// Include the chatbot routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);

// =======================
// SWAGGER API DOCUMENTATION
// =======================
const { specs, swaggerUi } = require('./swagger');

// Serve Swagger UI at /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Zero Health API Documentation'
}));

// Serve raw OpenAPI spec as JSON
app.get('/api/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

/**
 * @swagger
 * /api/debug/connection:
 *   get:
 *     tags: [Debug]
 *     summary: Get database connection details
 *     description: Retrieve current database connection configuration for monitoring
 *     responses:
 *       200:
 *         description: Database connection details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: postgres
 *                 host:
 *                   type: string
 *                   example: db
 *                 database:
 *                   type: string
 *                   example: zero_health
 *                 port:
 *                   type: integer
 *                   example: 5432
 */
// Exposed database connection for demonstration
app.get('/api/debug/connection', (req, res) => {
    res.json({
        user: pool.options.user,
        host: pool.options.host,
        database: pool.options.database,
        port: pool.options.port
    });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Debug]
 *     summary: API health check
 *     description: Basic health check endpoint
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: vulnerable
 */
// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'vulnerable' });
});

/**
 * @swagger
 * /api/debug/token:
 *   get:
 *     tags: [Debug]
 *     summary: Generate debug token (Development only)
 *     description: Generate a development token for testing purposes
 *     parameters:
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [patient, doctor, pharmacist, admin]
 *         description: Role for the debug token
 *       - name: id
 *         in: query
 *         schema:
 *           type: integer
 *         description: User ID for the debug token
 *     responses:
 *       200:
 *         description: Debug token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 debug_token:
 *                   type: string
 *                 warning:
 *                   type: string
 */
app.get('/api/debug/token', (req, res) => {
    const { role = 'patient', id = '1' } = req.query;
    
    // Generate weak debug token with no algorithm specification
    const debugToken = jwt.sign(
        { 
            id: parseInt(id), 
            email: `debug@${role}.com`, 
            role: role,
            debug: true
        },
        'debug-key',  // Weak secret
        { 
            expiresIn: '1h',
            algorithm: 'none'  // No signature verification
        }
    );
    
    res.json({
        debug_token: debugToken,
        role: role,
        id: id,
        warning: 'Debug token - not for production use'
    });
});

// =======================
// ADMIN ENDPOINTS - USER MANAGEMENT & STATISTICS
// =======================

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (Admin only)
 *     description: Retrieve a complete list of all users in the system (requires administrative privileges)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all users (admin only)
app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `SELECT id, email, role, first_name, last_name, phone, specialization, license_number, created_at 
             FROM users ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// ===== USER PROFILE UPDATE - Mass Assignment vulnerability =====
app.put('/api/users/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Mass assignment vulnerability - updates any field provided in request body
        const allowedFields = Object.keys(req.body);
        const updateValues = Object.values(req.body);
        
        if (allowedFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        // Build dynamic query - dangerous but educational
        const setClause = allowedFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, role, first_name, last_name`;
        
        console.log('Profile update query:', query);
        console.log('Update values:', updateValues);
        
        const result = await pool.query(query, [userId, ...updateValues]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ===== ADMIN SYSTEM MONITORING - Command Injection vulnerability =====
app.post('/api/admin/system', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { action, target } = req.body;
        
        // Command injection vulnerability - no input sanitization
        let command;
        switch (action) {
            case 'ping':
                command = `ping -c 3 ${target}`;
                break;
            case 'disk':
                command = `df -h ${target || '/'}`;
                break;
            case 'process':
                command = `ps aux | grep ${target || 'node'}`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        
        console.log('Admin executing system command:', command);
        
        const { exec } = require('child_process');
        exec(command, (error, stdout, stderr) => {
            if (error) {
                res.status(500).json({ error: error.message, command: command });
            } else {
                res.json({ 
                    output: stdout,
                    error: stderr,
                    command: command,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
    } catch (error) {
        console.error('System command error:', error);
        res.status(500).json({ error: 'System command failed' });
    }
});

// ===== AUTOMATIC SAMPLE DATA INITIALIZATION =====
async function initializeSampleDataOnStartup() {
    try {
        console.log('🔍 Checking if sample data initialization is needed...');
        
        // Import the initialization function
        const { initializeSampleData } = require('./scripts/init-sample-data');
        
        // Run initialization (it's idempotent - safe to run multiple times)
        await initializeSampleData();
        
    } catch (error) {
        console.log('⚠️ Sample data initialization failed, but continuing server startup:', error.message);
    }
}

// Wait for database and initialize sample data before starting server
const startServer = async () => {
    try {
        // Wait for database to be ready
        const { waitForDatabase } = require('./scripts/wait-for-db');
        await waitForDatabase();
        
        // Initialize sample data
        await initializeSampleDataOnStartup();
        
        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🌐 Zero Health Server running on port ${PORT}`);
            console.log('🏥 Healthcare Portal API initialized successfully');
            console.log('📧 Test Patient login: patient@test.com / password123');
            console.log('👩‍⚕️ Test Doctor login: doctor@test.com / password123');
        });
    } catch (error) {
        console.error('💥 Database connection failed:', error.message);
        console.log('🔄 Retrying in 5 seconds...');
        setTimeout(() => startServer(), 5000);
    }
};

// Start the server with initialization
startServer().catch(error => {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== FILE DOWNLOAD ENDPOINT - Directory Traversal vulnerability =====
app.get('/api/files/:filename', verifyToken, async (req, res) => {
    try {
        const { filename } = req.params;
        
        // Directory traversal vulnerability - direct concatenation allows ../../../etc/passwd
        const filePath = __dirname + '/uploads/' + filename;
        
        console.log('File download request:', filename);
        console.log('Resolved path:', filePath);
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('File download error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// ===== SEARCH ENDPOINT - Reflected XSS vulnerability =====

// ===== SYSTEM INFO ENDPOINT - Information Disclosure =====
app.get('/api/info', (req, res) => {
    // No authentication required - exposes system information
    res.json({
        application: 'Zero Health',
        version: '2.1.3',
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development',
        platform: process.platform,
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        database: {
            host: process.env.POSTGRES_HOST || 'db',
            port: process.env.POSTGRES_PORT || 5432,
            database: process.env.POSTGRES_DB || 'zero_health'
        },
        jwt_secret: JWT_SECRET,  // Exposed secret!
        admin_credentials: {
            email: 'admin@test.com',
            password: 'password123'
        },
        vulnerability_count: '∞',
        last_updated: '2024-12-15'
    });
});