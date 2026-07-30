const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { auth } = require('../middleware/auth');
const { sendNotification } = require('../utils/email');
const { body, validationResult } = require('express-validator');
const { strictLimiter } = require('../middleware/rateLimiter');

router.post('/', strictLimiter, 
  body('name').trim().notEmpty().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input data' });
    
    try {
      const msg = new ContactMessage(req.body);
      await msg.save();
      await sendNotification('New Contact Message', `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
