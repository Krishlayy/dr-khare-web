const http = require('http');

const endpoints = [
  { path: '/api/content', method: 'GET' },
  { path: '/api/publications', method: 'GET' },
  { path: '/api/blogs', method: 'GET' },
  { path: '/api/milestones', method: 'GET' },
  { path: '/api/reviews/public', method: 'GET' },
  { path: '/api/reviews/analytics', method: 'GET' }
];

async function testEndpoints() {
  for (const ep of endpoints) {
    await new Promise(resolve => {
      http.get(`http://localhost:5000${ep.path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`[${res.statusCode}] ${ep.method} ${ep.path}`);
          console.log(`Response length: ${data.length} chars. Sample: ${data.substring(0, 50)}...\n`);
          resolve();
        });
      }).on('error', err => {
        console.error(`❌ ${ep.method} ${ep.path} failed: ${err.message}`);
        resolve();
      });
    });
  }
}

testEndpoints();
