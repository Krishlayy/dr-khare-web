const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SiteContent = require('./models/SiteContent');
const Milestone = require('./models/Milestone');
const Publication = require('./models/Publication');
const BlogPost = require('./models/BlogPost');

dotenv.config();

const contentData = [
  {
    key: 'home_hero',
    value: {
      title: 'Advancing Healthcare Through Innovation',
      subtitle: 'Dr. Supreet Khare (MD, MPH, MBA, PhD) is a multi-disciplinary healthcare leader and physician. With extensive experience spanning clinical practice, executive leadership, and medical research, he currently serves as CEO of California Medical Behavioral Health and Medical Director of Occupational Medicine at Lompoc Valley Medical Center, focusing on population health and innovative care delivery.',
      cta1: 'Get in Touch',
      cta2: 'View Journey',
      image: 'https://res.cloudinary.com/demo/image/upload/v1615582963/docs/doctor-professional.jpg'
    },
    status: 'published'
  },
  {
    key: 'positioning_statement',
    value: 'Dr. Supreet Khare bridges the gap between rigorous clinical practice, executive healthcare leadership, and digital health innovation. With a unique foundation of multi-disciplinary expertise (MD, MPH, MBA, PhD) and an extensive portfolio of research, he champions evidence-based, population-level health solutions that empower both communities and healthcare systems.',
    status: 'published'
  },
  {
    key: 'micro_bio',
    value: 'Dr. Supreet Khare is a physician, researcher, and executive leader advancing population health through multi-disciplinary expertise.',
    status: 'published'
  },
  {
    key: 'contact_info',
    value: {
      email: 'drkhare@example.com',
      phone: '+1 (805) 555-0199',
      address: 'Lompoc Valley Medical Center, CA',
      linkedin: 'https://linkedin.com/in/drkhare',
      twitter: 'https://twitter.com/drkhare'
    },
    status: 'published'
  },
  {
    key: 'footer_details',
    value: {
      description: 'Advancing clinical practice and medical innovation through comprehensive leadership and research.',
      copyright: '© 2026 Dr. Supreet Khare. All rights reserved.',
      links: [
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' }
      ]
    },
    status: 'published'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drkhare');
    console.log('MongoDB Connected for Seeding');

    // Clear existing content and insert new content
    await SiteContent.deleteMany({});
    await SiteContent.insertMany(contentData);
    console.log('SiteContent Seeded successfully');

    // Add some milestones
    await Milestone.deleteMany({});
    await Milestone.insertMany([
      {
        title: 'CEO & Founder',
        institution: 'California Medical Behavioral Health',
        location: 'California, USA',
        startDate: new Date('2020-01-01'),
        endDate: null,
        description: 'Leading a comprehensive behavioral health organization focused on expanding access to care through innovative delivery models.',
        category: 'career',
        status: 'published'
      },
      {
        title: 'Medical Director of Occupational Medicine',
        institution: 'Lompoc Valley Medical Center',
        location: 'Lompoc, CA',
        startDate: new Date('2018-06-01'),
        endDate: null,
        description: 'Directing occupational health initiatives, ensuring workplace safety, and managing clinical operations.',
        category: 'career',
        status: 'published'
      }
    ]);
    console.log('Milestones Seeded successfully');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();
