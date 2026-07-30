const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['book', 'paper', 'chapter', 'article', 'degree', 'certificate', 'journal article'], required: true },
  authors: [{ type: String }],
  journal: { type: String },
  abstract: { type: String },
  year: { type: Number },
  publisher: { type: String },
  externalLink: { type: String },
  coverImage: { type: String },
  pdfLink: { type: String },
  order: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  lastEditor: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
