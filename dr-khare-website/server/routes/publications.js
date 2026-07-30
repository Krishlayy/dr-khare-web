const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');
const { auth, authorizeRoles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const pubs = await Publication.find().sort({ year: -1, createdAt: -1 });
    res.json(pubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const pub = new Publication(req.body);
    await pub.save();
    res.status(201).json(pub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const pub = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
