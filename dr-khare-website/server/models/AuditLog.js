const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
