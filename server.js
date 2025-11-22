require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// 1. Connect Database
connectDB();

// 2. Middleware
app.use(express.json()); // Allows JSON data in POST requests
app.use(cors()); // Allows Flutter to communicate with backend

// 3. Routes
app.use('/api/v1', apiRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));