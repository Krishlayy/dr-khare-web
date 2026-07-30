const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { auth } = require('../middleware/auth');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo', 
  api_key: process.env.CLOUDINARY_API_KEY || 'demo', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo' 
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }
    
    if (process.env.CLOUDINARY_API_KEY === 'demo' || !process.env.CLOUDINARY_API_KEY) {
      const fs = require('fs');
      const path = require('path');
      const ext = req.file.originalname.split('.').pop();
      const mockPublicId = `mock_demo_${Date.now()}`;
      fs.writeFileSync(path.join(__dirname, '../uploads', `${mockPublicId}.${ext}`), req.file.buffer);
      return res.json({ url: `/uploads/${mockPublicId}.${ext}` });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'drkhare/richtext' },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
