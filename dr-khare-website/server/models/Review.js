const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  source: {
    type: String,
    enum: ['direct', 'google', 'website'],
    default: 'direct'
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  googleReviewId: { type: String },
  publishPreference: {
    type: String,
    enum: ['publish_with_name', 'publish_anonymously'],
    default: 'publish_with_name'
  },
  rawResponses: { type: Object, default: {} },
  generatedReview: { type: String },
  finalSubmittedReview: { type: String },
  approvalTimestamp: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
