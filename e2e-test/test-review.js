const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/share-review', { waitUntil: 'networkidle0' });
  
  // Step 1: Click start or select rating
  // Assuming the page has the ReviewQuestionnaire component.
  // Wait for stars to appear.
  await page.waitForSelector('svg');
  // Click the 5th star
  const svgs = await page.$$('svg');
  if(svgs.length >= 5) await svgs[4].click();
  
  // Click Next
  let buttons = await page.$$('button');
  await buttons[buttons.length - 1].click();

  // Step 2: Fill text areas
  await page.waitForSelector('textarea');
  const textareas = await page.$$('textarea');
  await textareas[0].type('Routine Checkup');
  await textareas[1].type('Excellent communication');
  await textareas[2].type('Very compassionate');
  
  // Click Next
  buttons = await page.$$('button');
  await buttons[buttons.length - 1].click();

  // Generate Summary
  await page.waitForTimeout(500);
  buttons = await page.$$('button');
  await buttons[buttons.length - 1].click();
  
  // Wait for summary generation
  await page.waitForTimeout(3000);
  
  // Submit
  buttons = await page.$$('button');
  await buttons[buttons.length - 1].click();
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/hello/.gemini/antigravity/brain/0754f5ed-2d83-420a-8fb5-a68eabd9e340/review_success.png' });
  
  console.log("Review submitted via UI.");
  
  await browser.close();
})();
