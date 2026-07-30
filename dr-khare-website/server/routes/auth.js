const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');
const { auth } = require('../middleware/auth');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Seed an initial admin user (only if none exists)
router.post('/seed', async (req, res) => {
  try {
    const count = await AdminUser.countDocuments();
    if (count > 0) return res.status(400).json({ error: 'Admin already exists' });
    
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = new AdminUser({ username: 'admin', email: 'admin@drkhare.com', passwordHash, role: 'superadmin' });
    await admin.save();
    res.status(201).json({ message: 'Admin seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({ token: accessToken, user: { username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    const user = await AdminUser.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    const { accessToken } = generateTokens(user);
    res.json({ token: accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

router.get('/me', auth, (req, res) => {
  res.json({ user: { username: req.user.username, email: req.user.email, role: req.user.role } });
});

module.exports = router;
