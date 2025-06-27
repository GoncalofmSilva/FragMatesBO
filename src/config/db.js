import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT || 3306

// Connect to the SQLite database
const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
    let connection
  try {
    connection = await pool.getConnection();
    await connection.ping(); // Simple query to verify connection
    console.log('✅ Database connected successfully!');
    connection.release(); // Release back to the pool
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err; // Optional: Rethrow to let the caller handle
  }
}

testConnection()

export default pool