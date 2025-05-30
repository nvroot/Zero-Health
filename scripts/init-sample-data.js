const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'zero_health',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
});

// Check if database has sample data
async function hasSampleData() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', ['patient@test.com']);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.log('❌ Error checking for sample data:', error.message);
    return false;
  }
}

// Check if tables exist
async function tablesExist() {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.log('❌ Error checking for tables:', error.message);
    return false;
  }
}

// Initialize database schema
async function initializeSchema() {
  try {
    console.log('🔧 Initializing database schema...');
    
    const schemaPath = path.join(__dirname, '../database/init.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Database schema initialized successfully!');
    return true;
  } catch (error) {
    console.log('❌ Error initializing schema:', error.message);
    return false;
  }
}

// Add sample users
async function addSampleUsers() {
  try {
    console.log('👥 Adding sample users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Add test patient
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, date_of_birth, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO NOTHING`,
      ['John', 'Doe', 'patient@test.com', hashedPassword, 'patient', '1985-06-15', '+1-555-0123']
    );
    
    // Add test doctor
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, specialization, license_number, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (email) DO NOTHING`,
      ['Dr. Sarah', 'Johnson', 'doctor@test.com', hashedPassword, 'doctor', 'Internal Medicine', 'MD12345', '+1-555-0456']
    );
    
    // Add additional doctors with specializations
    const doctors = [
      ['Dr. Michael', 'Smith', 'dr.smith@zerohealth.com', 'Cardiology', 'MD12346'],
      ['Dr. Emily', 'Brown', 'dr.brown@zerohealth.com', 'Orthopedics', 'MD12347'],
      ['Dr. James', 'Davis', 'dr.davis@zerohealth.com', 'Pediatrics', 'MD12348'],
      ['Dr. Lisa', 'Wilson', 'dr.wilson@zerohealth.com', 'Dermatology', 'MD12349']
    ];
    
    for (const [firstName, lastName, email, specialization, license] of doctors) {
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, specialization, license_number, phone) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (email) DO NOTHING`,
        [firstName, lastName, email, hashedPassword, 'doctor', specialization, license, '+1-555-0999']
      );
    }
    
    console.log('✅ Sample users added successfully!');
    return true;
  } catch (error) {
    console.log('❌ Error adding sample users:', error.message);
    return false;
  }
}

// Add sample medical data
async function addSampleMedicalData() {
  try {
    console.log('🏥 Adding sample medical data...');
    
    // Get patient and doctor IDs
    const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
    const doctorResult = await pool.query('SELECT id FROM users WHERE email = $1', ['doctor@test.com']);
    
    if (patientResult.rows.length === 0 || doctorResult.rows.length === 0) {
      console.log('❌ Could not find test users for medical data');
      return false;
    }
    
    const patientId = patientResult.rows[0].id;
    const doctorId = doctorResult.rows[0].id;
    
    // Add medical records
    await pool.query(
      `INSERT INTO medical_records (user_id, title, content, created_at) 
       VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [
        patientId,
        'Annual Physical Exam - 2024',
        `Patient presents for routine annual physical examination. Overall health is good.

VITAL SIGNS:
- Blood Pressure: 128/82 mmHg
- Heart Rate: 72 bpm
- Temperature: 98.6°F
- Weight: 165 lbs
- Height: 5'8"
- BMI: 25.1

ASSESSMENT:
- Slightly elevated blood pressure - monitoring
- Vitamin D insufficiency - supplementation recommended
- Overall good health status

PLAN:
- Continue current medications
- Lifestyle modifications for blood pressure
- Follow-up in 6 months
- Repeat lab work in 3 months`,
        new Date()
      ]
    );
    
    // Add prescriptions
    const prescriptions = [
      ['Lisinopril', '10mg', 'Once daily', '6 months', 'Take with food. Monitor blood pressure regularly.', 'active'],
      ['Metformin', '500mg', 'Twice daily with meals', '6 months', 'Take with breakfast and dinner. Monitor blood sugar levels.', 'active'],
      ['Ibuprofen', '400mg', 'As needed for pain', '1 month', 'Take with food. Do not exceed 3 doses per day.', 'collected'],
      ['Vitamin D3', '2000 IU', 'Once daily', '12 months', 'Take with a meal for better absorption.', 'active']
    ];
    
    for (const [medication, dosage, frequency, duration, instructions, status] of prescriptions) {
      await pool.query(
        `INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, duration, instructions, status, prescribed_date, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
        [patientId, doctorId, medication, dosage, frequency, duration, instructions, status, new Date(), new Date()]
      );
    }
    
    // Add lab results
    const labResults = [
      ['Complete Blood Count (CBC)', 'completed', '{"wbc": "7.2", "rbc": "4.5", "hemoglobin": "14.2", "hematocrit": "42.1", "platelets": "285"}'],
      ['Comprehensive Metabolic Panel', 'completed', '{"glucose": "92", "bun": "18", "creatinine": "1.0", "sodium": "140", "potassium": "4.2", "chloride": "102"}'],
      ['Lipid Panel', 'completed', '{"total_cholesterol": "195", "ldl": "110", "hdl": "55", "triglycerides": "150"}'],
      ['Thyroid Function (TSH)', 'completed', '{"tsh": "2.1", "t4": "1.2", "t3": "3.1"}'],
      ['Hemoglobin A1C', 'completed', '{"a1c": "5.4"}'],
      ['Vitamin D', 'completed', '{"vitamin_d_25oh": "22"}']
    ];
    
    for (const [testName, status, resultData] of labResults) {
      await pool.query(
        `INSERT INTO lab_results (patient_id, doctor_id, test_name, test_date, status, result_data, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
        [patientId, doctorId, testName, new Date(), status, resultData, new Date()]
      );
    }
    
    console.log('✅ Sample medical data added successfully!');
    return true;
  } catch (error) {
    console.log('❌ Error adding sample medical data:', error.message);
    return false;
  }
}

// Add sample chat history
async function addSampleChatHistory() {
  try {
    console.log('💬 Adding sample chat history...');
    
    const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
    if (patientResult.rows.length === 0) {
      console.log('❌ Could not find test patient for chat history');
      return false;
    }
    
    const patientId = patientResult.rows[0].id;
    
    // Add sample chat conversations
    const chatHistory = [
      ['Hello, I need help with my health records', 'Hello! I can help you access your health records. What specific information are you looking for?'],
      ['Can you show me my current prescriptions?', 'I can retrieve your current prescriptions for you. Let me access that information from our database.'],
      ['What services does Zero Health provide?', 'Zero Health provides comprehensive healthcare services including online appointment booking, medical record access, prescription management, lab result viewing, secure messaging with healthcare providers, and 24/7 AI health assistant support.'],
      ['I have a headache, should I see a doctor?', 'For occasional headaches, over-the-counter pain relievers like ibuprofen or acetaminophen may help. However, if headaches are frequent, severe, or accompanied by other symptoms like fever, vision changes, or neck stiffness, you should consult with a healthcare provider.']
    ];
    
    for (const [userMessage, botResponse] of chatHistory) {
      await pool.query(
        `INSERT INTO chat_history (user_id, message, response, created_at) 
         VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [patientId, userMessage, botResponse, new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)] // Random time in last week
      );
    }
    
    console.log('✅ Sample chat history added successfully!');
    return true;
  } catch (error) {
    console.log('❌ Error adding sample chat history:', error.message);
    return false;
  }
}

// Main initialization function
async function initializeSampleData() {
  try {
    console.log('🚀 Starting sample data initialization...');
    
    // Check if tables exist
    if (!(await tablesExist())) {
      console.log('📋 Database tables not found, initializing schema...');
      if (!(await initializeSchema())) {
        console.log('❌ Failed to initialize database schema');
        if (require.main === module) process.exit(1);
        return false;
      }
      // Wait a moment for schema to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Check if sample data already exists
    if (await hasSampleData()) {
      console.log('✅ Sample data already exists, skipping initialization');
      console.log('📧 You can login with: patient@test.com / password123');
      console.log('👩‍⚕️ Or as doctor: doctor@test.com / password123');
      if (require.main === module) process.exit(0);
      return true;
    }
    
    console.log('📦 No sample data found, adding initial data...');
    
    // Add all sample data
    let success = true;
    success = success && await addSampleUsers();
    success = success && await addSampleMedicalData();
    success = success && await addSampleChatHistory();
    
    if (success) {
      console.log('\n🎉 Sample data initialization completed successfully!');
      console.log('📧 Patient login: patient@test.com / password123');
      console.log('👩‍⚕️ Doctor login: doctor@test.com / password123');
      console.log('🌐 Visit: http://localhost:3000');
      
      // Create a marker file to indicate initialization is complete
      const markerPath = path.join(__dirname, '../.sample-data-initialized');
      fs.writeFileSync(markerPath, new Date().toISOString());
      
      if (require.main === module) process.exit(0);
      return true;
    } else {
      console.log('❌ Sample data initialization failed');
      if (require.main === module) process.exit(1);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Fatal error during sample data initialization:', error);
    if (require.main === module) process.exit(1);
    return false;
  } finally {
    // Only close the pool if running as standalone script
    if (require.main === module) {
      await pool.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeSampleData();
}

module.exports = { initializeSampleData }; 