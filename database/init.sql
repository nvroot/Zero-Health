-- Deliberately weak database configuration
-- No password complexity requirements
-- No encryption
-- Predictable IDs
-- Excessive permissions
-- Weak constraints

-- Create users table with weak security
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255), -- Will store plaintext passwords
    email VARCHAR(100),
    role VARCHAR(20), -- No enum type for role validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Create patients table with weak security
CREATE TABLE patients (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    ssn VARCHAR(11), -- Storing SSN in plaintext
    address TEXT,
    phone VARCHAR(20),
    emergency_contact TEXT,
    medical_history TEXT, -- Storing sensitive data in plaintext
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table with weak security
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    specialization VARCHAR(100),
    license_number VARCHAR(50), -- No validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table with weak security
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date TIMESTAMP,
    status VARCHAR(20), -- No enum type for status validation
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table with weak security
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    medication_name VARCHAR(100),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20), -- No enum type for status validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lab_results table with weak security
CREATE TABLE lab_results (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    patient_id INTEGER REFERENCES patients(id),
    test_name VARCHAR(100),
    result TEXT, -- Storing sensitive data in plaintext
    test_date DATE,
    uploaded_by INTEGER REFERENCES users(id),
    file_path TEXT, -- Storing file paths without validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table with weak security
CREATE TABLE messages (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT, -- No XSS protection
    attachment_path TEXT, -- No file type validation
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table with weak security
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY, -- Predictable IDs
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100),
    details TEXT, -- Storing sensitive data in plaintext
    ip_address VARCHAR(45), -- No validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create deliberately weak indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_patients_ssn ON patients(ssn); -- Index on sensitive data
CREATE INDEX idx_patients_dob ON patients(date_of_birth);

-- Insert some test data with weak security
INSERT INTO users (username, password, email, role) VALUES
('admin', 'admin123', 'admin@zerohealth.com', 'admin'),
('doctor1', 'doctor123', 'doctor1@zerohealth.com', 'doctor'),
('patient1', 'patient123', 'patient1@zerohealth.com', 'patient');

-- Grant excessive permissions (deliberately weak)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres; 