const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const { auth, authorizeRoles } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Get all users (Superadmin only)
router.get('/', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const users = await AdminUser.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user (Superadmin only)
router.post('/', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    let user = await AdminUser.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    user = new AdminUser({ username, email, passwordHash, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (Superadmin only)
router.delete('/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (Superadmin only)
router.put('/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await AdminUser.findById(req.params.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'User updated successfully', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
