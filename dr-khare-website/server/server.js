const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');

dotenv.config();

const app = express();

// Middleware
app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to be loaded
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});
app.use('/api', limiter);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SEO Routes
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${process.env.API_URL || 'http://localhost:5000'}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const BlogPost = require('./models/BlogPost');
    const posts = await BlogPost.find({ status: 'published' }).select('slug updatedAt');
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static routes
    const staticRoutes = ['', '/journey', '/blogs', '/contact', '/reviews', '/leave-review'];
    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${clientUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });
    
    // Dynamic blog routes
    posts.forEach(post => {
      xml += `  <url>\n    <loc>${clientUrl}/blogs/${post.slug}</loc>\n    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Database Connection
const startDatabase = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Started MongoDB Memory Server');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected to', mongoUri);
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

startDatabase();

// Routes (to be added)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/content', require('./routes/content'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/media', require('./routes/media'));
app.use('/api/health', require('./routes/health'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error', message: err.message });
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`[Validation] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Validation] Runtime PORT: ${PORT}`);
  console.log(`[Validation] JWT/auth initialization: ${process.env.JWT_SECRET ? 'SUCCESS' : 'MISSING'}`);
  console.log(`[Validation] Cloudinary initialization: ${process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'demo' ? 'SUCCESS (Live Keys)' : 'SUCCESS (Demo Fallback)'}`);
});
