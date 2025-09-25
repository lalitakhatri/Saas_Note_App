// backend/api/routes/tenantRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { upgradeTenant } = require('../controllers/tenantController');

// This specific endpoint is for automated testing as requested.
router.post('/:slug/upgrade', protect, isAdmin, upgradeTenant);
module.exports = router;