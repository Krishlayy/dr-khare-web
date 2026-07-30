require('dotenv').config();
const mongoose = require('mongoose');
const Milestone = require('./models/Milestone');
const BlogPost = require('./models/BlogPost');
const Review = require('./models/Review');
const ContactMessage = require('./models/ContactMessage');
const Publication = require('./models/Publication');

async function purgeSyntheticData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // We keep Content (Admin configs) and Users
    
    const mRes = await Milestone.deleteMany({ title: { $regex: /Test|Sample|Fake|Generated/i } });
    console.log(`Deleted ${mRes.deletedCount} synthetic Milestones.`);

    const bRes = await BlogPost.deleteMany({ title: { $regex: /Test|Sample|Fake|Generated/i } });
    console.log(`Deleted ${bRes.deletedCount} synthetic BlogPosts.`);

    const rRes = await Review.deleteMany({ patientName: { $regex: /Test|Sample|Fake|Generated/i } });
    console.log(`Deleted ${rRes.deletedCount} synthetic Reviews.`);

    const cRes = await ContactMessage.deleteMany({ name: { $regex: /Test|Sample|Fake|Generated/i } });
    console.log(`Deleted ${cRes.deletedCount} synthetic Contacts.`);

    const pRes = await Publication.deleteMany({ title: { $regex: /Test|Sample|Fake|Generated/i } });
    console.log(`Deleted ${pRes.deletedCount} synthetic Publications.`);

    console.log('Purge complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

purgeSyntheticData();
