const { Pool } = require('pg');

const waitForDatabase = async (maxRetries = 30, retryInterval = 2000) => {
    const pool = new Pool({
        user: process.env.POSTGRES_USER || 'postgres',
        host: process.env.POSTGRES_HOST || 'db',
        database: process.env.POSTGRES_DB || 'zero_health',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        port: process.env.POSTGRES_PORT || 5432,
    });

    console.log('🔄 Waiting for database connection...');
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('✅ Database connection established!');
            await pool.end();
            return true;
        } catch (error) {
            console.log(`⏳ Database not ready (attempt ${i + 1}/${maxRetries}): ${error.message}`);
            if (i === maxRetries - 1) {
                console.error('💥 Database connection failed after maximum retries');
                await pool.end();
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }
};

module.exports = { waitForDatabase }; 