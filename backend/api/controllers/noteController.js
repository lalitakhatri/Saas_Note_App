// backend/api/controllers/noteController.js
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const { tenantId, userId } = req.user;

  try {
    const tenant = await Tenant.findById(tenantId);
    if (tenant.plan === 'free') {
      const noteCount = await Note.countDocuments({ tenantId });
      if (noteCount >= 3) {
        return res.status(403).json({ message: 'Free plan limit of 3 notes reached. Please upgrade.' });
      }
    }

    const note = new Note({ title, content, tenantId, userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    let note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title || note.title;
    note.content = content || note.content;
    
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};