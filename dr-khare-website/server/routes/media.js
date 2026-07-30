const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');
const { auth } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo', 
  api_key: process.env.CLOUDINARY_API_KEY || 'demo', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo' 
});

const upload = multer({ storage: multer.memoryStorage() });

// Get all media
router.get('/', auth, async (req, res) => {
  try {
    const { category, folder, tag } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (folder) filter.folder = folder;
    if (tag) filter.tags = tag;
    
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload new media to Cloudinary
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { category, description, folder, tags } = req.body;
    
    let inferredCategory = category || 'other';
    let resourceType = 'auto';
    if (!category) {
      if (req.file.mimetype.startsWith('image/')) inferredCategory = 'image';
      else if (req.file.mimetype.startsWith('video/')) {
        inferredCategory = 'video';
        resourceType = 'video';
      }
      else if (req.file.mimetype.startsWith('application/pdf')) {
        inferredCategory = 'document';
        resourceType = 'raw';
      }
    }

    // If running in demo mode (no real credentials), simulate Cloudinary upload for staging test
    if (process.env.CLOUDINARY_API_KEY === 'demo' || !process.env.CLOUDINARY_API_KEY) {
      const fs = require('fs');
      const path = require('path');
      const ext = req.file.originalname.split('.').pop();
      const mockPublicId = `mock_demo_${Date.now()}`;
      const mockSecureUrl = `/uploads/${mockPublicId}.${ext}`;
      
      fs.writeFileSync(path.join(__dirname, '../uploads', `${mockPublicId}.${ext}`), req.file.buffer);
      
      const newMedia = new Media({
        filename: mockPublicId,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: mockSecureUrl,
        category: inferredCategory,
        description: description || 'Simulated Cloudinary Upload',
        folder: folder || 'root',
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim()).filter(Boolean)) : []
      });

      await newMedia.save();
      return res.status(201).json(newMedia);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `drkhare/${folder || 'root'}`, resource_type: resourceType },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const newMedia = new Media({
          filename: result.public_id,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: result.secure_url,
          category: inferredCategory,
          description: description || '',
          folder: folder || 'root',
          tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim()).filter(Boolean)) : []
        });

        await newMedia.save();
        res.status(201).json(newMedia);
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update media metadata
router.put('/:id', auth, async (req, res) => {
  try {
    const { description, category, folder, tags } = req.body;
    
    const updateData = { description, category };
    if (folder !== undefined) updateData.folder = folder;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim()).filter(Boolean);

    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedMedia) return res.status(404).json({ error: 'Media not found' });
    res.json(updatedMedia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete media
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Delete from Cloudinary
    if (media.filename) {
      await cloudinary.uploader.destroy(media.filename);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
