const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  name: {
    type: String,
    required: false
  },
  segment: {
    type: String,
    enum: ['general', 'patients', 'professionals', 'researchers'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],
    default: 'subscribed'
  }
}, { timestamps: true });

module.exports = mongoose.model('NewsletterSub', newsletterSchema);
