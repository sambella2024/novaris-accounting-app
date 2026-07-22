const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');

    // Read and execute migrations
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file !== 'run.js')
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`📝 Running ${file}...`);
      await pool.query(sql);
      console.log(`✅ ${file} completed`);
    }

    console.log('✅ All migrations completed successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Migration error:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
