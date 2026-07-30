const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  category: { type: String, enum: ['image', 'video', 'document', 'other'], default: 'other' },
  folder: { type: String, default: 'root' },
  tags: [{ type: String }],
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
