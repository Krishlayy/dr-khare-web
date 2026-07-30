require('dotenv').config();
const mongoose = require('mongoose');

const runCleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('Connected to DB for cleanup.');

    // Remove any milestones/publications/reviews with "dummy", "test", or numbers matching a timestamp pattern
    const db = mongoose.connection.db;

    // Remove test publications
    const pubResult = await db.collection('publications').deleteMany({
      $or: [
        { title: { $regex: /Publication \d{13}/ } },
        { title: { $regex: /test/i } },
        { title: { $regex: /dummy/i } }
      ]
    });
    console.log(`Deleted ${pubResult.deletedCount} test publications.`);

    // Remove test milestones
    const milestoneResult = await db.collection('milestones').deleteMany({
      $or: [
        { title: { $regex: /test/i } },
        { title: { $regex: /dummy/i } }
      ]
    });
    console.log(`Deleted ${milestoneResult.deletedCount} test milestones.`);

    // Remove test reviews
    const reviewResult = await db.collection('reviews').deleteMany({
      $or: [
        { patientName: { $regex: /test/i } },
        { text: { $regex: /dummy/i } }
      ]
    });
    console.log(`Deleted ${reviewResult.deletedCount} test reviews.`);

    console.log('Cleanup complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runCleanup();
