// backend/api/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Initialize Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

// API Health Check Endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// This is the part that was missing or not working.
// It starts the server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// This is for Vercel deployment, but app.listen will still run locally.
module.exports = app;