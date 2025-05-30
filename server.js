const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Deliberately weak JWT secret
const JWT_SECRET = 'zero-health-super-secret-key'; // Deliberately weak secret

// Deliberately weak security configurations
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

// Deliberately weak database configuration
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'zero_health',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
});

// Database initialization
const initializeDatabase = async () => {
    try {
        // Create users table with expanded role fields
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(50) DEFAULT 'patient',
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                phone VARCHAR(20),
                date_of_birth DATE,
                gender VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create medical_records table with no access control
        await pool.query(`
            CREATE TABLE IF NOT EXISTS medical_records (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                title VARCHAR(255),
                content TEXT,
                file_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create appointments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES users(id),
                doctor_id INTEGER REFERENCES users(id),
                appointment_date TIMESTAMP,
                status VARCHAR(50) DEFAULT 'scheduled',
                reason TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create lab_results table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lab_results (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES users(id),
                doctor_id INTEGER REFERENCES users(id),
                test_name VARCHAR(255),
                result_data TEXT,
                test_date DATE,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create prescriptions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES users(id),
                doctor_id INTEGER REFERENCES users(id),
                medication_name VARCHAR(255),
                dosage VARCHAR(100),
                frequency VARCHAR(100),
                duration VARCHAR(100),
                instructions TEXT,
                status VARCHAR(50) DEFAULT 'prescribed',
                prescribed_date DATE DEFAULT CURRENT_DATE,
                collected_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id),
                recipient_id INTEGER REFERENCES users(id),
                subject VARCHAR(255),
                content TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert some test data for doctors
        await pool.query(`
            INSERT INTO users (email, password, role, first_name, last_name, phone) 
            VALUES 
                ('doctor@test.com', '$2a$05$L5v99KsS2oVqeSvtIEMAh.Q.nZyTcJUk5VazpH9Fi6UdwchzsszhS', 'doctor', 'Dr. John', 'Smith', '555-0101'),
                ('pharmacist@test.com', '$2a$05$L5v99KsS2oVqeSvtIEMAh.Q.nZyTcJUk5VazpH9Fi6UdwchzsszhS', 'pharmacist', 'Jane', 'Doe', '555-0102')
            ON CONFLICT (email) DO NOTHING;
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

initializeDatabase();

// Deliberately weak JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('Token verification attempt:', token ? 'Token present' : 'No token');
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        // Deliberately weak: No proper algorithm specification
        const decoded = jwt.verify(token, JWT_SECRET);
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

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
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
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason) 
             VALUES ('${patient_id}', '${doctor_id}', '${appointment_date}', '${reason}') 
             RETURNING *`
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.get('/api/doctors', verifyToken, async (req, res) => {
    try {
        // SQL injection vulnerable query
        const result = await pool.query(
            `SELECT id, first_name, last_name, email FROM users WHERE role = 'doctor'`
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
        let params = [userId];
        
        if (userRole === 'patient') {
            query = `SELECT lr.*, 
                           d.first_name as doctor_first_name, d.last_name as doctor_last_name
                     FROM lab_results lr 
                     JOIN users d ON lr.doctor_id = d.id 
                     WHERE lr.patient_id = $1`;
        } else if (userRole === 'doctor') {
            query = `SELECT lr.*, 
                           p.first_name as patient_first_name, p.last_name as patient_last_name
                     FROM lab_results lr 
                     JOIN users p ON lr.patient_id = p.id 
                     WHERE lr.doctor_id = $1`;
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get lab results error:', error);
        res.status(500).json({ error: 'Failed to get lab results' });
    }
});

app.post('/api/lab-results', verifyToken, async (req, res) => {
    try {
        const { patient_id, test_name, result_data, test_date } = req.body;
        const doctor_id = req.user.id;
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `INSERT INTO lab_results (patient_id, doctor_id, test_name, result_data, test_date) 
             VALUES ('${patient_id}', '${doctor_id}', '${test_name}', '${result_data}', '${test_date}') 
             RETURNING *`
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create lab result error:', error);
        res.status(500).json({ error: 'Failed to create lab result' });
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
        const { patient_id, medication_name, dosage, frequency, duration, instructions } = req.body;
        const doctor_id = req.user.id;
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions) 
             VALUES ('${patient_id}', '${doctor_id}', '${medication_name}', '${dosage}', '${frequency}', '${duration}', '${instructions}') 
             RETURNING *`
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create prescription error:', error);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

app.put('/api/prescriptions/:id/collect', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // SQL injection vulnerable query
        const result = await pool.query(
            `UPDATE prescriptions SET status = 'collected', collected_date = CURRENT_DATE 
             WHERE id = '${id}' 
             RETURNING *`
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
        // SQL injection vulnerable query
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, phone FROM users WHERE role = 'patient'`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ error: 'Failed to get patients' });
    }
});

// Exposed database connection for demonstration
app.get('/api/debug/connection', (req, res) => {
    res.json({
        user: pool.options.user,
        host: pool.options.host,
        database: pool.options.database,
        port: pool.options.port
    });
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'vulnerable' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Warning: This is a deliberately vulnerable application for educational purposes');
}); 