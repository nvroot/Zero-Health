const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { Pool } = require('pg');

const app = express();

// Deliberately weak security configurations
app.use(cors({
    origin: '*', // Allow all origins
    credentials: true
}));

// Weak session configuration
app.use(session({
    secret: 'zero-health-secret', // Weak secret
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Not using HTTPS
        httpOnly: false, // Allow JavaScript access
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Deliberately weak database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'zero_health',
    password: 'postgres', // Weak password
    port: 5432,
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