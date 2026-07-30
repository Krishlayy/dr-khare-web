const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Future integration point for RAG pipeline (Vector DB connection goes here)
    // AI must strictly use only approved website content, publications, CV data, blogs, and admin-managed knowledge.
    
    const kbContent = await SiteContent.findOne({ sectionKey: 'chatbot_kb' });
    const fallbackMessage = "I am an AI assistant limited to Dr. Khare's approved clinical data, publications, and professional biography. I currently do not have the specific information you are looking for in my knowledge base. Please refer to the 'Journey' or 'Publications' pages, or use the Contact form for a direct inquiry.";
    
    // Simple stub: just echo a static or dynamically configured response
    res.json({ 
      reply: kbContent?.value?.default_reply || fallbackMessage,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
