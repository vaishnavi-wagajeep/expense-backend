const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');

// 👉 TEMP STORAGE
let expenses = [];

/* ================= ADD EXPENSE ================= */
router.post('/add', verifyToken, (req, res) => {
  try {
    const { Category, Amount, Date: expenseDate, Notes } = req.body;

    if (!Category || !Amount || !expenseDate) {
      return res.status(400).json({
        error: "Category, Amount and Date are required"
      });
    }

    const dateObj = new Date(expenseDate);

    const newExpense = {
      ExpenseID: Date.now(),
      Category,
      Amount: parseFloat(Amount),
      Date: expenseDate,
      Notes: Notes || "",
      userId: req.user ? req.user.id : "demoUser",

      // ✅ month + year
      month: dateObj.getMonth(),
      year: dateObj.getFullYear()
    };

    expenses.push(newExpense);

    res.status(201).json({
      message: "Expense added successfully",
      data: newExpense
    });

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({
      error: "Server error while adding expense"
    });
  }
});

/* ================= GET EXPENSES (UPDATED) ================= */
router.get('/', verifyToken, (req, res) => {
  try {
    const { month, year } = req.query;

    let filteredExpenses = expenses;

    // ✅ If frontend sends month/year → filter
    if (month !== undefined && year !== undefined) {
      filteredExpenses = expenses.filter(exp =>
        exp.month === Number(month) &&
        exp.year === Number(year)
      );
    }

    res.json(filteredExpenses);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({
      error: "Error fetching expenses"
    });
  }
});

/* ================= DELETE EXPENSE ================= */
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);

    expenses = expenses.filter(exp => exp.ExpenseID !== id);

    res.json({
      message: "Expense deleted"
    });

  } catch (err) {
    res.status(500).json({
      error: "Delete failed"
    });
  }
});

module.exports = router;