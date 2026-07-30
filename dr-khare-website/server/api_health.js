async function checkHealth() {
  const endpoints = [
    '/api/content',
    '/api/publications',
    '/api/milestones',
    '/api/reviews', // It is /api/reviews in the code, wait, let me check routes/reviews.js
    '/api/auth/me'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`);
      console.log(`GET ${endpoint} -> ${res.status} ${res.statusText}`);
    } catch (err) {
      console.log(`GET ${endpoint} -> ERROR: ${err.message}`);
    }
  }
}
checkHealth();
