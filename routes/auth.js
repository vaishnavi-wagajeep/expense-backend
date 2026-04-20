const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// ✅ SIGNUP
// =======================
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // 🔒 Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 🔍 Check if email already exists
    const checkSql = "SELECT * FROM Users WHERE Email = ?";
    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // 🔐 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)";

      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "User registered successfully" });
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// ✅ LOGIN
// =======================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 🔒 Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM Users WHERE Email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔑 JWT Token
    const token = jwt.sign(
      { id: user.UserID, email: user.Email },
      process.env.JWT_SECRET,   // ✅ FIXED
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });
  });
});

module.exports = router;