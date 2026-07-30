const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

// Models
const Review = require('../models/Review');
const BlogPost = require('../models/BlogPost');
const Milestone = require('../models/Milestone');
const Publication = require('../models/Publication');
const NewsletterSub = require('../models/NewsletterSub');
const Media = require('../models/Media');
const ContactMessage = require('../models/ContactMessage');
const os = require('os');

// Helper to get directory size
function getDirSize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  return size;
}

router.get('/dashboard', auth, async (req, res) => {
  try {
    // Check DB Status
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Check SMTP Status (just env vars check, can't reliably ping without sending)
    const smtpStatus = (process.env.EMAIL_USER && process.env.EMAIL_PASS) ? 'configured' : 'missing';

    // Check AI Provider Status
    const aiStatus = (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY) ? 'configured' : 'missing';

    // Check Upload Storage Status
    let uploadStatus = 'unknown';
    try {
      fs.accessSync(path.join(__dirname, '../uploads'), fs.constants.W_OK);
      uploadStatus = 'writable';
    } catch (e) {
      uploadStatus = 'unwritable';
    }

    // Get Counts
    const counts = {
      reviews: await Review.countDocuments(),
      blogs: await BlogPost.countDocuments(),
      milestones: await Milestone.countDocuments(),
      publications: await Publication.countDocuments(),
      subscribers: await NewsletterSub.countDocuments(),
      media: await Media.countDocuments(),
      contacts: await ContactMessage.countDocuments()
    };

    let storageUsed = 0;
    try {
      storageUsed = getDirSize(path.join(__dirname, '../uploads'));
    } catch (e) {
      console.error(e);
    }

    res.json({
      health: {
        database: dbStatus,
        smtp: smtpStatus,
        ai: aiStatus,
        storage: uploadStatus,
        uptime: process.uptime(),
        systemUptime: os.uptime(),
        storageUsed
      },
      counts,
      versions: {
        backend: pkg.version || '1.0.0',
        frontend: pkg.version || '1.0.0',
        node: process.version
      },
      lastAdminLogin: new Date().toISOString() // Assuming current user is admin
    });

  } catch (err) {
    res.status(500).json({ error: 'Health check failed', message: err.message });
  }
});

module.exports = router;
