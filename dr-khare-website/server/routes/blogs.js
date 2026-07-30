const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const AuditLog = require('../models/AuditLog');
const { auth, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/', async (req, res) => {
  try {
    const { status, limit, skip, category, tag } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (tag) query.tags = tag;
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 0)
      .populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected
router.post('/', auth, async (req, res) => {
  try {
    const post = new BlogPost({ ...req.body, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (post) {
      await AuditLog.create({ action: 'Deleted BlogPost', adminId: req.user._id, details: { title: post.title } });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
