// backend/api/routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');

router.route('/').post(protect, createNote).get(protect, getNotes);
router.route('/:id').get(protect, getNoteById).put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;