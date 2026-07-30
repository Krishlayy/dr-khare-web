require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');
const Milestone = require('./models/Milestone');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dr-khare-website');
    console.log('Connected to MongoDB.');

    // 1. Seed About Page Data
    const aboutData = {
      headline: "Advancing Healthcare Through Visionary Leadership",
      subheadline: "Dr. Supreet Khare (MD, MPH, MBA, PhD) bridges the gap between rigorous clinical practice, executive healthcare leadership, and digital health innovation.",
      professional_bio: "Dr. Supreet Khare is a distinguished physician, executive, and researcher whose career embodies a profound commitment to the intersection of clinical excellence, healthcare leadership, and technological innovation. Holding multiple advanced credentials—including an MD, MPH, MBA, and PhD—Dr. Khare has consistently pursued continuous learning and holistic patient care.\n\nHe currently guides global health content and digital strategy as the Managing Director and CEO of Compendious Med Works Pvt. Ltd, and oversees clinical operations as the CEO of California Medical Behavioral Health. Additionally, his role as Medical Director of Occupational and Environmental Medicine at Lompoc Valley Medical Center underscores his dedication to regulatory compliance and workplace health.",
      leadership_philosophy: "Effective healthcare leadership requires a synthesis of clinical empathy, operational efficiency, and a relentless pursuit of innovation to improve patient outcomes at a population level.",
      healthcare_vision: "The future of healthcare lies in the seamless integration of digital health technologies, predictive analytics, and value-based care models that prioritize preventive medicine and holistic wellness.",
      industry_impact: "Through extensive peer-reviewed publications and executive directorships, Dr. Khare has shaped policies supporting clinician well-being, occupational health standards, and clinical documentation integrity.",
      innovation_contributions: "Pioneering the integration of AI and data analytics into clinical workflows to enhance diagnostic accuracy and optimize healthcare delivery systems across multiple institutional frameworks.",
      personal_mission: "To continuously elevate the standard of care by empowering communities, advancing medical research, and fostering environments where both patients and healthcare providers can thrive."
    };

    await SiteContent.findOneAndUpdate(
      { key: 'about_page' },
      { value: aboutData },
      { upsert: true }
    );
    console.log('About page data seeded.');

    // 2. Seed Journey Milestones
    await Milestone.deleteMany({}); // Clear existing to prevent duplicates

    const milestones = [
      {
        title: "Medical Director - Occupational and Environmental Medicine",
        institution: "Lompoc Valley Medical Center",
        location: "California, United States",
        startDate: new Date('2025-01-01'), // Future date based on CV
        category: "career",
        status: "published",
        order: 1,
        description: "Lead occupational health programs including fitness-for-duty, return-to-work, and regulatory compliance.",
        context: "Managing occupational health for a major regional medical center.",
        challenges: "Balancing strict regulatory compliance with the urgent needs of the workforce.",
        outcomes: "Streamlined return-to-work protocols and enhanced workplace safety standards."
      },
      {
        title: "Physician",
        institution: "Signify Health Texas",
        location: "Texas, United States",
        startDate: new Date('2024-01-01'),
        category: "career",
        status: "published",
        order: 2,
        description: "Support value-based care and population health management initiatives.",
        impact: "Directly contributed to improved health metrics across broad patient populations through strategic health management."
      },
      {
        title: "Chief Executive Officer (CEO)",
        institution: "California Medical Behavioral Health (CMBH)",
        location: "California, United States",
        startDate: new Date('2021-10-01'),
        category: "career",
        status: "published",
        order: 3,
        description: "Oversaw operations, clinical research, and expansion.",
        leadership_philosophy: "Fostering an environment of comprehensive behavioral and medical integration."
      },
      {
        title: "Managing Director / CEO",
        institution: "Compendious Med Works Pvt. Ltd",
        location: "Global",
        startDate: new Date('2019-12-01'),
        category: "career",
        status: "published",
        order: 4,
        description: "Led global health content, digital strategy, and healthcare consulting.",
        innovation_contributions: "Spearheaded digital transformation initiatives for healthcare providers internationally."
      },
      {
        title: "Occupational Medicine Resident",
        institution: "University of Cincinnati",
        location: "Cincinnati, OH",
        startDate: new Date('2023-07-01'),
        endDate: new Date('2025-07-01'),
        category: "education",
        status: "published",
        order: 5,
        description: "Specialized residency training under Supervisor Victoria Wulsin, MD, DrPH."
      },
      {
        title: "Internal Medicine Residency",
        institution: "University of Arizona College of Medicine",
        location: "Tucson, AZ",
        startDate: new Date('2016-06-01'),
        endDate: new Date('2019-01-01'),
        category: "education",
        status: "published",
        order: 6,
        description: "ACGME-Accredited Internal Medicine Residency."
      },
      {
        title: "5x ICMR Short Term Studentship",
        institution: "Indian Council of Medical Research",
        startDate: new Date('2010-01-01'),
        endDate: new Date('2014-12-31'),
        category: "award",
        status: "published",
        order: 7,
        description: "First and only undergraduate student in India to be awarded the ICMR research scholarship consecutively for 5 years."
      },
      {
        title: "Champion's Trophy",
        institution: "Karmic Conference",
        startDate: new Date('2014-01-01'),
        category: "award",
        status: "published",
        order: 8,
        description: "Awarded by Nobel Laureate Dr. Robin Warren after winning among 600 research papers."
      }
    ];

    await Milestone.insertMany(milestones);
    console.log(`Seeded ${milestones.length} milestones.`);

    console.log('Executive data seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
