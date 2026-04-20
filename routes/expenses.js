const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');


// =======================
// ✅ ADD EXPENSE
// =======================
router.post('/add', verifyToken, (req, res) => {
  const { category, amount, date, notes } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!category || !amount || !date) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  const sql = `
    INSERT INTO Expenses (UserID, Category, Amount, Date, Notes)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, category, amount, date, notes], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Expense added successfully" });
  });
});


// =======================
// ✅ GET ALL EXPENSES
// =======================
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM Expenses WHERE UserID = ? ORDER BY Date DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


// =======================
// ✅ UPDATE EXPENSE
// =======================
router.put('/update/:id', verifyToken, (req, res) => {
  const expenseId = req.params.id;
  const { category, amount, date, notes } = req.body;
  const userId = req.user.id;

  const sql = `
    UPDATE Expenses 
    SET Category = ?, Amount = ?, Date = ?, Notes = ?
    WHERE ExpenseID = ? AND UserID = ?
  `;

  db.query(
    sql,
    [category, amount, date, notes, expenseId, userId],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Expense updated successfully" });
    }
  );
});


// =======================
// ✅ DELETE EXPENSE
// =======================
router.delete('/delete/:id', verifyToken, (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  const sql = "DELETE FROM Expenses WHERE ExpenseID = ? AND UserID = ?";

  db.query(sql, [expenseId, userId], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Expense deleted successfully" });
  });
});


module.exports = router;
