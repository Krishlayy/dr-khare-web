const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

const defaultContent = {
  global_footer: {
    title: "Dr. Supreet Khare",
    credentials: "MD • MPH • MBA • PhD",
    bio: "Physician, healthcare executive, and ICMR scholar focused on the critical intersection of occupational health, systemic resilience, and the future of care delivery.",
    newsletter_title: "The Executive Brief",
    newsletter_desc: "Subscribe for periodic updates on occupational medicine, policy shifts, and featured academic insights.",
    copyright: "© 2026 Dr. Supreet Khare. All rights reserved.",
    links: [
      { label: "Biography", url: "/about", category: "Quick Navigation" },
      { label: "Career Timeline", url: "/journey", category: "Quick Navigation" },
      { label: "Publications", url: "/publications", category: "Quick Navigation" },
      { label: "Insights & Ideas", url: "/insights", category: "Featured Insights" },
      { label: "Patient Experiences", url: "/reviews", category: "Featured Insights" },
      { label: "AI Assistant", url: "/ask", category: "Contact & Connect" },
      { label: "LinkedIn Profile", url: "https://linkedin.com", category: "Contact & Connect" },
      { label: "Get in Touch", url: "/contact", category: "Contact & Connect" }
    ]
  },
  page_contact: {
    title: "Get in Touch",
    subtitle: "For clinical consultations, speaking engagements, or academic collaborations, please connect via the secure channel below.",
    locations: [
      { name: "Primary Clinic", address: "123 Medical Plaza, Suite 400\nHealthcare District", phone: "+1 (555) 123-4567" },
      { name: "Academic Office", address: "University Medical Center\nResearch Wing, Room 302", phone: "+1 (555) 987-6543" }
    ],
    emails: [
      { name: "Clinical Inquiries", address: "clinical@drkhare.com" },
      { name: "Academic & Speaking", address: "academic@drkhare.com" }
    ]
  },
  global_seo: {
    site_name: "Dr. Supreet Khare",
    default_title: "Dr. Supreet Khare | Occupational Medicine & Healthcare Executive",
    default_description: "Physician, healthcare executive, and ICMR scholar focused on the critical intersection of occupational health, systemic resilience, and the future of care delivery.",
    logo_url: "/logo.png",
    favicon_url: "/favicon.ico"
  },
  homepage_content: {
    hero_title: "Advancing Occupational Health & Systemic Resilience",
    hero_subtitle: "Bridging clinical excellence with strategic healthcare leadership.",
    hero_background: "",
    about_snippet: "Dr. Supreet Khare is a physician and healthcare executive committed to transforming care delivery models. With an MD in Occupational Medicine, an MPH, and an MBA, his work spans direct patient care, hospital administration, and academic research.",
    cta_primary_text: "View Biography",
    cta_primary_url: "/about",
    cta_secondary_text: "Contact",
    cta_secondary_url: "/contact"
  }
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    for (const [key, value] of Object.entries(defaultContent)) {
      await SiteContent.findOneAndUpdate({ key }, { $setOnInsert: { value } }, { upsert: true });
    }
    
    console.log("Default content seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
