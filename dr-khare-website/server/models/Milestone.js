const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null means "present"
  title: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  category: { type: String, enum: ['education', 'career', 'award', 'recognition', 'publication'], required: true },
  order: { type: Number, default: 0 }, // manual override for sorting if needed
  slug: { type: String, unique: true, sparse: true },
  coverImage: { type: String },
  gallery: [{ type: String }],
  narrative: { type: String }, // rich text
  context: { type: String },
  challenges: { type: String },
  outcomes: { type: String },
  impact: { type: String },
  lessonsLearned: { type: String },
  achievements: [{ type: String }],
  memories: [{ type: String }],
  documents: [{ title: { type: String }, url: { type: String } }],
  relatedPublications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  lastEditor: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
