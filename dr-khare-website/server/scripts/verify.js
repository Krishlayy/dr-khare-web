require('dotenv').config();
const mongoose = require('mongoose');
const Milestone = require('../models/Milestone');
const Publication = require('../models/Publication');
const BlogPost = require('../models/BlogPost');
const NewsletterSub = require('../models/NewsletterSub');

const verifyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully for verification');

    const milestones = await Milestone.countDocuments();
    const publications = await Publication.countDocuments();
    const blogs = await BlogPost.countDocuments();
    const subs = await NewsletterSub.countDocuments();

    console.log('--- DATABASE COUNTS ---');
    console.log(`Milestones: ${milestones}`);
    console.log(`Publications: ${publications}`);
    console.log(`Blog Posts: ${blogs}`);
    console.log(`Newsletter Subscribers: ${subs}`);
    console.log('-----------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  }
};

verifyDB();
