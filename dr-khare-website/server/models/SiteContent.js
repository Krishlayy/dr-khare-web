const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  sectionKey: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
