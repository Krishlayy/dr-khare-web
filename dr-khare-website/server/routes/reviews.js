const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth, authorizeRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

let strictLimiter;
try { strictLimiter = require('../middleware/rateLimiter').strictLimiter; } catch(e) { strictLimiter = (req, res, next) => next(); }

let sendNotification;
try { sendNotification = require('../utils/email').sendNotification; } catch(e) { sendNotification = () => Promise.resolve(); }

// Public route to get only approved reviews
router.get('/public', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for AI summary generation
router.post('/generate-summary', strictLimiter, async (req, res) => {
  try {
    const { treatment, communication, strengths, recommend } = req.body;
    let summary = `I had a wonderful experience.`;
    if (treatment) summary += ` I visited for ${treatment}.`;
    if (communication) summary += ` The communication was ${communication}.`;
    if (strengths) summary += ` I particularly liked ${strengths}.`;
    if (recommend === 'yes') summary += ` I highly recommend Dr. Khare and the team!`;
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Public route to submit a review
router.post('/', strictLimiter,
  body('patientName').optional({ checkFalsy: true }).trim().escape(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('text').trim().notEmpty().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Review Validation Error:', errors.array());
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }

    try {
      const review = new Review({
        patientName: req.body.patientName || 'Anonymous Patient',
        rating: req.body.rating,
        text: req.body.text,
        source: req.body.source || 'direct',
        status: 'pending',
        publishPreference: req.body.publishPreference || 'publish_with_name',
        rawResponses: req.body.rawResponses || {},
        generatedReview: req.body.generatedReview || '',
        finalSubmittedReview: req.body.finalSubmittedReview || req.body.text,
        googleReviewId: req.body.googleReviewId
      });
      await review.save();
      
      await sendNotification('New Patient Review', `Name: ${req.body.patientName}\nRating: ${req.body.rating}\nText: ${req.body.text}`).catch(console.error);
      
      res.status(201).json({ message: 'Review submitted successfully and is pending approval.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

// Admin/Superadmin route to moderate reviews
router.get('/', auth, authorizeRole('admin', 'superadmin'), async (req, res) => {
  try {
    const reviews = await Review.find();
    
    const order = { 'pending': 1, 'approved': 2, 'rejected': 3 };
    const sortedReviews = reviews.sort((a, b) => {
      if (order[a.status] === order[b.status]) {
        return b.createdAt - a.createdAt;
      }
      return order[a.status] - order[b.status];
    });

    res.json(sortedReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin/Superadmin route to update review status
router.put('/:id', auth, authorizeRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const updateData = { status };
    if (status === 'approved') {
      updateData.approvalTimestamp = new Date();
    }

    const review = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin/Superadmin route to delete a review
router.delete('/:id', auth, authorizeRole('admin', 'superadmin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Keep existing analytics route for dashboard compatibility
router.get('/analytics', async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const approved = await Review.countDocuments({ status: 'approved' });
    const pending = await Review.countDocuments({ status: 'pending' });
    const rejected = await Review.countDocuments({ status: 'rejected' });
    
    const named = await Review.countDocuments({ publishPreference: 'publish_with_name' });
    const anonymous = await Review.countDocuments({ publishPreference: 'publish_anonymously' });

    const aggr = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const distribution = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    const ratingDist = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    distribution.forEach(d => {
      ratingDist[String(d._id)] = d.count;
    });

    res.json({
      total, approved, pending, rejected, named, anonymous, ratingDist,
      averageRating: aggr.length > 0 ? aggr[0].avgRating : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
