const express = require('express');
const router = express.Router();
const NewsletterSub = require('../models/NewsletterSub');
const { auth } = require('../middleware/auth');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, segment } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let sub = await NewsletterSub.findOne({ email });
    if (sub) {
      if (sub.status === 'unsubscribed') {
        sub.status = 'subscribed';
        if (name) sub.name = name;
        if (segment) sub.segment = segment;
        await sub.save();
        return res.status(200).json({ message: 'Resubscribed successfully' });
      }
      return res.status(400).json({ error: 'Email is already subscribed' });
    }

    sub = new NewsletterSub({ 
      email, 
      name: name || '', 
      segment: segment || 'general' 
    });
    await sub.save();
    
    // Here we would normally trigger an email via NodeMailer
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/newsletter
// @desc    Get all subscribers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { segment } = req.query;
    const query = segment ? { segment } : {};
    const subs = await NewsletterSub.find(query).sort({ createdAt: -1 });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/newsletter/send
// @desc    Mock send newsletter to segment
// @access  Private
router.post('/send', auth, async (req, res) => {
  try {
    const { subject, body, segment } = req.body;
    const query = { status: 'subscribed' };
    if (segment && segment !== 'all') {
      query.segment = segment;
    }
    const recipients = await NewsletterSub.countDocuments(query);
    
    // In production, this would queue NodeMailer jobs
    res.json({ message: `Newsletter queued for sending to ${recipients} subscribers.`, recipients });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
