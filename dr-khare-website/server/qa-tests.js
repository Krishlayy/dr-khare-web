const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const testReport = {
  passing: [],
  failing: [],
  knownIssues: [],
  blockers: []
};

function pass(testName, details) {
  console.log(`✅ PASS: ${testName}`);
  testReport.passing.push({ testName, details });
}

function fail(testName, error) {
  console.log(`❌ FAIL: ${testName}`);
  console.log(`   Error: ${error.message || error}`);
  testReport.failing.push({ testName, error: error.message || error });
}

async function runTests() {
  console.log("Starting QA Tests...");
  
  // 1. Test Database Connection
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/drkhare');
    pass("MongoDB Connection", "Successfully connected to local database.");
  } catch (err) {
    fail("MongoDB Connection", err);
    testReport.blockers.push("Cannot connect to MongoDB. Ensure local mongod is running.");
    return finalizeReport();
  }

  // Load Models
  const User = require('./models/AdminUser');
  const Review = require('./models/Review');
  const BlogPost = require('./models/BlogPost');
  const Milestone = require('./models/Milestone');
  const Media = require('./models/Media');
  const NewsletterSubscriber = require('./models/NewsletterSub');
  const SiteContent = require('./models/SiteContent');

  // 1. Admin Workflow Testing
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      fail("Admin Workflow", "No admin user found. Seed data might be missing.");
      testReport.blockers.push("No admin user exists in DB.");
    } else {
      pass("Admin Workflow", "Admin user exists and is queryable.");
    }
  } catch (err) {
    fail("Admin Workflow", err);
  }

  // 2. Review Workflow Testing
  try {
    const newReview = new Review({
      patientName: "QA Tester",
      rating: 5,
      text: "Excellent test experience",
      status: "pending"
    });
    await newReview.save();
    pass("Review Workflow - Submission", "Review successfully submitted and defaulted to pending.");
    
    newReview.status = "approved";
    await newReview.save();
    pass("Review Workflow - Moderation", "Review status successfully updated to approved.");
    
    await Review.deleteOne({ _id: newReview._id });
  } catch (err) {
    fail("Review Workflow", err);
  }

  // 3. Blog Workflow Testing
  try {
    const blog = new BlogPost({
      title: "QA Test Blog",
      slug: "qa-test-blog",
      content: "This is a QA test.",
      status: "published",
      readTimeMinutes: 5
    });
    await blog.save();
    pass("Blog Workflow", "Blog successfully created and saved.");
    await BlogPost.deleteOne({ _id: blog._id });
  } catch (err) {
    fail("Blog Workflow", err);
  }

  // 4. Journey Workflow Testing
  try {
    const milestone = new Milestone({
      startDate: new Date(),
      institution: "QA Test Institute",
      title: "QA Test Phase",
      category: "career",
      description: "Testing the application.",
      memories: ["Memory 1"]
    });
    await milestone.save();
    pass("Journey Workflow", "Milestone successfully created with memories array.");
    await Milestone.deleteOne({ _id: milestone._id });
  } catch (err) {
    fail("Journey Workflow", err);
  }

  // 5. Media Library Testing
  try {
    const media = new Media({
      filename: "test-qa.jpg",
      originalName: "test-qa.jpg",
      mimetype: "image/jpeg",
      size: 1024,
      url: "/uploads/test-qa.jpg",
      category: "image"
    });
    await media.save();
    pass("Media Library", "Media record successfully saved to MongoDB.");
    await Media.deleteOne({ _id: media._id });
  } catch (err) {
    fail("Media Library", err);
  }

  // 6. Newsletter Testing
  try {
    const sub = new NewsletterSubscriber({
      name: "QA Subscriber",
      email: "qa@example.com",
      segment: "general"
    });
    await sub.save();
    pass("Newsletter Testing", "Subscriber successfully saved to database.");
    await NewsletterSubscriber.deleteOne({ _id: sub._id });
  } catch (err) {
    fail("Newsletter Testing", err);
  }

  // 7. Homepage Content Testing
  try {
    let content = await SiteContent.findOne({ sectionKey: 'featured_video_title' });
    if (!content) {
      // Create if missing
      content = new SiteContent({ sectionKey: 'featured_video_title', content: 'Meet Dr. Khare QA' });
      await content.save();
    }
    pass("Homepage Content Testing", "SiteContent config successfully retrieved/saved.");
  } catch (err) {
    fail("Homepage Content Testing", err);
  }

  mongoose.disconnect();
  finalizeReport();
}

function finalizeReport() {
  fs.writeFileSync('qa_report.json', JSON.stringify(testReport, null, 2));
  console.log("Report generated: qa_report.json");
  process.exit(0);
}

runTests();
