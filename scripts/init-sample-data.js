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

// Check if specific data exists
async function hasSpecificData(tableName, condition = '') {
  try {
    let query = `SELECT COUNT(*) FROM ${tableName}`;
    if (condition) query += ` WHERE ${condition}`;
    
    const result = await pool.query(query);
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.log(`❌ Error checking for ${tableName} data:`, error.message);
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
    const schemaPath = path.join(__dirname, '../database/init.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    return true;
  } catch (error) {
    console.log('❌ Error initializing schema:', error.message);
    return false;
  }
}

// Main initialization function
async function initializeSampleData() {
  const startTime = Date.now();
  console.log('🚀 Starting sample data initialization...');
  
  try {
    // Step 1: Check and initialize schema if needed
    console.log('📋 Step 1: Checking database schema...');
    if (!(await tablesExist())) {
      console.log('🔧 Database tables not found, initializing schema...');
      await initializeSchema();
      console.log('✅ Database schema initialized successfully!');
    } else {
      console.log('✅ Database schema already exists');
    }
    
    // Step 2: Check and create users
    console.log('\n👥 Step 2: Checking users...');
    if (!(await hasSpecificData('users', "email = 'patient@test.com'"))) {
      console.log('📝 Creating sample users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Add admin user
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
        ['Admin', 'User', 'admin@zerohealth.com', hashedPassword, 'admin', '+1-555-0001']
      );
      
      // Add test patient
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, date_of_birth, phone) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (email) DO NOTHING`,
        ['John', 'Doe', 'patient@test.com', hashedPassword, 'patient', '1985-06-15', '+1-555-0123']
      );
      
      // Add test doctor
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
        ['Dr. Sarah', 'Johnson', 'doctor@test.com', hashedPassword, 'doctor', '+1-555-0456']
      );
      
      // Add additional doctors
      const doctors = [
        ['Dr. Michael', 'Smith', 'dr.smith@zerohealth.com'],
        ['Dr. Emily', 'Brown', 'dr.brown@zerohealth.com'],
        ['Dr. James', 'Davis', 'dr.davis@zerohealth.com'],
        ['Dr. Lisa', 'Wilson', 'dr.wilson@zerohealth.com']
      ];
      
      for (const [firstName, lastName, email] of doctors) {
        await pool.query(
          `INSERT INTO users (first_name, last_name, email, password, role, phone) 
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
          [firstName, lastName, email, hashedPassword, 'doctor', '+1-555-0999']
        );
      }
      
      console.log('✅ Sample users created successfully!');
    } else {
      console.log('✅ Sample users already exist');
    }
    
    // Step 3: Check and create medical records
    console.log('\n📋 Step 3: Checking medical records...');
    if (!(await hasSpecificData('medical_records'))) {
      console.log('📝 Creating sample medical records...');
      
      // Get user IDs
      const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
      const doctorResult = await pool.query('SELECT id FROM users WHERE email = $1', ['doctor@test.com']);
      
      if (patientResult.rows.length > 0 && doctorResult.rows.length > 0) {
        const patientId = patientResult.rows[0].id;
        
        const records = [
          {
            title: "Annual Physical Exam",
            content: "Patient appears healthy. Blood pressure: 120/80. Weight: 165 lbs. No significant issues noted."
          },
          {
            title: "Blood Test Results",
            content: "Complete blood count normal. Cholesterol slightly elevated at 210 mg/dL. Recommend dietary changes."
          },
          {
            title: "Follow-up Visit",
            content: "Patient reports feeling well. Minor cold symptoms resolved. Continue current medications."
          }
        ];
        
        for (const record of records) {
          await pool.query(
            `INSERT INTO medical_records (user_id, title, content) 
             VALUES ($1, $2, $3)`,
            [patientId, record.title, record.content]
          );
        }
        
        console.log('✅ Sample medical records created successfully!');
      } else {
        console.log('⚠️ Cannot create medical records: test users not found');
      }
    } else {
      console.log('✅ Sample medical records already exist');
    }
    
    // Step 4: Check and create prescriptions
    console.log('\n💊 Step 4: Checking prescriptions...');
    if (!(await hasSpecificData('prescriptions'))) {
      console.log('📝 Creating sample prescriptions...');
      
      // Get user IDs
      const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
      const doctorResult = await pool.query('SELECT id FROM users WHERE email = $1', ['doctor@test.com']);
      
      if (patientResult.rows.length > 0 && doctorResult.rows.length > 0) {
        const patientId = patientResult.rows[0].id;
        const doctorId = doctorResult.rows[0].id;
        
        const prescriptions = [
          ['Lisinopril', '10mg', 'Once daily', '2024-01-01', '2024-07-01', 'active'],
          ['Metformin', '500mg', 'Twice daily with meals', '2024-01-01', '2024-07-01', 'active'],
          ['Ibuprofen', '400mg', 'As needed for pain', '2024-01-01', '2024-02-01', 'completed'],
          ['Vitamin D3', '2000 IU', 'Once daily', '2024-01-01', '2024-12-31', 'active']
        ];
        
        for (const [medication, dosage, frequency, startDate, endDate, status] of prescriptions) {
          await pool.query(
            `INSERT INTO prescriptions (patient_id, doctor_id, medication_name, dosage, frequency, start_date, end_date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [patientId, doctorId, medication, dosage, frequency, startDate, endDate, status]
          );
        }
        
        console.log('✅ Sample prescriptions created successfully!');
      } else {
        console.log('⚠️ Cannot create prescriptions: test users not found');
      }
    } else {
      console.log('✅ Sample prescriptions already exist');
    }
    
    // Step 5: Check and create lab results
    console.log('\n🧪 Step 5: Checking lab results...');
    if (!(await hasSpecificData('lab_results'))) {
      console.log('📝 Creating sample lab results...');
      
      // Get user IDs
      const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
      const doctorResult = await pool.query('SELECT id FROM users WHERE email = $1', ['doctor@test.com']);
      
      if (patientResult.rows.length > 0 && doctorResult.rows.length > 0) {
        const patientId = patientResult.rows[0].id;
        const doctorId = doctorResult.rows[0].id;
        
        const labResults = [
          ['Complete Blood Count (CBC)', 'WBC: 7.2, RBC: 4.5, Hemoglobin: 14.2, Hematocrit: 42.1, Platelets: 285', '2024-01-15'],
          ['Comprehensive Metabolic Panel', 'Glucose: 92, BUN: 18, Creatinine: 1.0, Sodium: 140, Potassium: 4.2', '2024-01-15'],
          ['Lipid Panel', 'Total Cholesterol: 195, LDL: 110, HDL: 55, Triglycerides: 150', '2024-02-01'],
          ['Thyroid Function (TSH)', 'TSH: 2.1, T4: 1.2, T3: 3.1', '2024-02-15'],
          ['Hemoglobin A1C', 'A1C: 5.4%', '2024-03-01'],
          ['Vitamin D', 'Vitamin D 25-OH: 22 ng/mL', '2024-03-15']
        ];
        
        for (const [testName, result, testDate] of labResults) {
          await pool.query(
            `INSERT INTO lab_results (patient_id, doctor_id, test_name, result, test_date) 
             VALUES ($1, $2, $3, $4, $5)`,
            [patientId, doctorId, testName, result, testDate]
          );
        }
        
        console.log('✅ Sample lab results created successfully!');
      } else {
        console.log('⚠️ Cannot create lab results: test users not found');
      }
    } else {
      console.log('✅ Sample lab results already exist');
    }
    
    // Step 6: Check and create appointments
    console.log('\n📅 Step 6: Checking appointments...');
    if (!(await hasSpecificData('appointments'))) {
      console.log('📝 Creating sample appointments...');
      
      // Get user IDs
      const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
      const doctorResult = await pool.query('SELECT id FROM users WHERE email = $1', ['doctor@test.com']);
      
      if (patientResult.rows.length > 0 && doctorResult.rows.length > 0) {
        const patientId = patientResult.rows[0].id;
        const doctorId = doctorResult.rows[0].id;
        
        const appointments = [
          ['2024-01-15 09:00:00', 'completed', 'Annual physical examination completed. Patient in good health.'],
          ['2024-02-20 14:30:00', 'completed', 'Follow-up blood pressure check. Blood pressure stable.'],
          ['2024-12-15 10:00:00', 'scheduled', 'Routine check-up scheduled.'],
          ['2024-12-22 11:30:00', 'scheduled', 'Lab results review appointment.']
        ];
        
        for (const [appointmentDate, status, notes] of appointments) {
          await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes) 
             VALUES ($1, $2, $3, $4, $5)`,
            [patientId, doctorId, appointmentDate, status, notes]
          );
        }
        
        console.log('✅ Sample appointments created successfully!');
      } else {
        console.log('⚠️ Cannot create appointments: test users not found');
      }
    } else {
      console.log('✅ Sample appointments already exist');
    }
    
    // Step 7: Check and create chat history
    console.log('\n💬 Step 7: Checking chat history...');
    if (!(await hasSpecificData('chat_history'))) {
      console.log('📝 Creating sample chat history...');
      
      const patientResult = await pool.query('SELECT id FROM users WHERE email = $1', ['patient@test.com']);
      if (patientResult.rows.length > 0) {
        const patientId = patientResult.rows[0].id;
        
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
            [patientId, userMessage, botResponse, new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)]
          );
        }
        
        console.log('✅ Sample chat history created successfully!');
      } else {
        console.log('⚠️ Cannot create chat history: test patient not found');
      }
    } else {
      console.log('✅ Sample chat history already exists');
    }
    
    // Final summary
    const duration = Date.now() - startTime;
    console.log(`\n🎉 Sample data initialization completed in ${duration}ms`);
    console.log('📧 You can login with: patient@test.com / password123');
    console.log('👩‍⚕️ Or as doctor: doctor@test.com / password123');
    
    return true;
  } catch (error) {
    console.log('❌ Sample data initialization failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  initializeSampleData();
}

module.exports = { initializeSampleData }; 