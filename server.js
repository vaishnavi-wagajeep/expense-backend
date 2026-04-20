const express = require('express');
const db = require('./config/db');

const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/authMiddleware');
const expenseRoutes = require('./routes/expenses');



app.use('/auth', authRoutes);











app.use('/expenses', expenseRoutes);



app.get('/', (req, res) => {
  res.send("API is running...");
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
