const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const { auth, authorizeRoles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ startDate: -1, order: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const milestone = await Milestone.findOne({ slug: req.params.slug }).populate('relatedPublications');
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    let slug = req.body.slug;
    if (!slug) {
      slug = (req.body.title + '-' + req.body.institution).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await Milestone.findOne({ slug });
      if (existing) slug += '-' + Date.now();
    }
    const milestone = new Milestone({ ...req.body, slug });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(milestone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
