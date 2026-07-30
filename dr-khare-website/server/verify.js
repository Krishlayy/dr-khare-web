const http = require('http');

async function testApi(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function postApi(path, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: 'localhost', port: 5000, path: path, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        };
        const req = http.request(options, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: resData }));
        });
        req.on('error', reject); req.write(data); req.end();
    });
}

async function run() {
    console.log("=== API VERIFICATION ===");
    const endpoints = ['/api/content', '/api/publications', '/api/blogs', '/api/milestones', '/api/reviews/public', '/api/reviews/analytics'];
    for (const ep of endpoints) {
        const res = await testApi(ep);
        console.log(`GET ${ep} \nStatus: ${res.status} \nSample: ${res.data.substring(0, 100)}...\n`);
    }

    console.log("=== REVIEW WORKFLOW ===");
    const reviewData = { patientName: "Evidence Test", rating: 5, text: "Verification text", publishPreference: "publish_with_name" };
    const submitRes = await postApi('/api/reviews', reviewData);
    console.log(`Submit Status: ${submitRes.status}`);

    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/dr-khare');
    const Review = require('./dr-khare-website/server/models/Review');
    
    let doc = await Review.findOne({ patientName: "Evidence Test" }).sort({ createdAt: -1 });
    console.log("MongoDB Document (Before Approval):");
    console.log(JSON.stringify(doc, null, 2));

    doc.status = 'approved';
    doc.approvalTimestamp = new Date();
    await doc.save();

    console.log("\nMongoDB Document (After Approval):");
    const updatedDoc = await Review.findById(doc._id);
    console.log(JSON.stringify(updatedDoc, null, 2));

    const pubRes = await testApi('/api/reviews/public');
    const pubReviews = JSON.parse(pubRes.data);
    const found = pubReviews.find(r => r._id === doc._id.toString());
    console.log(`\nFound in public API? ${!!found}`);

    await mongoose.disconnect();
}

run().catch(console.error);
