const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const { auth, authorizeRole } = require('../middleware/auth');

// PUBLIC: Fetch full site dictionary object (locked-in frontend path)
router.get('/', async (req, res) => {
  try {
    const items = await SiteContent.find({});
    const dictionary = items.reduce((acc, item) => {
      acc[item.sectionKey] = item.content;
      return acc;
    }, {});
    res.json(dictionary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to compile content dictionary', details: err.message });
  }
});

// SUPERADMIN ONLY: Mutate content node(s) (locked-in frontend path)
router.post('/', auth, authorizeRole('superadmin'), async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await SiteContent.findOneAndUpdate(
        { sectionKey: key },
        { content: value, lastModifiedBy: req.user._id },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update content', details: err.message });
  }
});

// Alias for new specification compatibility (optional, but good practice)
router.get('/dictionary', (req, res) => res.redirect('/api/content'));

router.put('/:sectionKey', auth, authorizeRole('superadmin'), async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await SiteContent.findOneAndUpdate(
      { sectionKey: req.params.sectionKey },
      { content, lastModifiedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content node', details: err.message });
  }
});

module.exports = router;
