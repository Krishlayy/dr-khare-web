const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'editor'], default: 'editor' },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
