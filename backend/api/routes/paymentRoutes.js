// backend/api/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// The admin of a company is responsible for upgrading
router.post('/create-order', protect, isAdmin, createOrder);
router.post('/verify', protect, isAdmin, verifyPayment);

module.exports = router;