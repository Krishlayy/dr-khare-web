const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let requests = [];

  page.on('request', request => {
    requests.push(request.url());
  });

  await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle0' });
  
  const relevantRequests = requests.filter(url => url.includes('/admin') || url.includes('/login') || url.includes('/auth/me'));
  console.log(relevantRequests);
  
  await browser.close();
})();
