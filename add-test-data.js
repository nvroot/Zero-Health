const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'zero_health',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
});

async function addTestData() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Add test patient
    const testPatient = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id`,
      ['John', 'Doe', 'patient@test.com', hashedPassword, 'patient']
    );
    
    // Add test doctor
    const testDoctor = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id`,
      ['Dr. Sarah', 'Johnson', 'doctor@test.com', hashedPassword, 'doctor']
    );

    console.log('✅ Test users created successfully!');
    console.log('📧 Patient login: patient@test.com / password123');
    console.log('👩‍⚕️ Doctor login: doctor@test.com / password123');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test data:', error.message);
    process.exit(1);
  }
}

addTestData(); 