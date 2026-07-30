const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'editor', 'moderator'], default: 'editor' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    let admin = await AdminUser.findOne({ email: 'admin@drkhare.com' });
    if (!admin) {
        console.log("Admin not found! Creating new admin.");
        admin = new AdminUser({ username: 'admin', email: 'admin@drkhare.com', role: 'superadmin' });
    }
    
    admin.passwordHash = await bcrypt.hash('admin123', 10);
    await admin.save();
    console.log("Admin password updated to 'admin123' for email 'admin@drkhare.com'");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
