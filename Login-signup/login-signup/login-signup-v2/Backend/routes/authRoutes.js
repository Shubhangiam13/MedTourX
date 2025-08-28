import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router(); // Create router instance

// Create database pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Sign Up Route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  pool.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Export router (Default export for ES Module)
export default router;
