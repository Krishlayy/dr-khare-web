const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  status: { type: String, enum: ['draft', 'published', 'scheduled', 'archived'], default: 'draft' },
  publishDate: { type: Date },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  readTimeMinutes: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook to calculate read time
blogPostSchema.pre('save', function() {
  if (this.isModified('content')) {
    const words = this.content.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length;
    this.readTimeMinutes = Math.ceil(words / 200); // avg reading speed 200 wpm
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
