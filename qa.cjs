const { chromium } = require('C:/Users/choji/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  const url = 'file:///' + path.resolve(__dirname, 'dist/index.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'load' });
  await page.screenshot({ path: path.resolve(__dirname, 'dashboard-desktop.png'), fullPage: true });
  await page.locator('#startDate').fill('2026-09-02');
  await page.locator('#endDate').fill('2026-09-02');
  await page.locator('#regionSelect').selectOption('용강동');
  const monthlyValue = await page.locator('#volumeValue').textContent();
  const dailyRankCount = await page.locator('#tradeRank .rank-row').count();
  const dailyRankDate = await page.locator('#tradeRank .rank-row').first().textContent();
  const removedIndexCards = await page.locator('.index-card').count();
  const removedGaugeCards = await page.locator('.gauge-card').count();
  await page.locator('[data-location="ktx"]').click();
  const ktxTitle = await page.locator('#detailTitle').textContent();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.resolve(__dirname, 'dashboard-mobile.png'), fullPage: true });
  console.log(JSON.stringify({ title: await page.title(), monthlyValue, dailyRankCount, dailyRankDate, removedIndexCards, removedGaugeCards, ktxTitle, errors, bodyWidth: await page.evaluate(() => document.body.scrollWidth), viewportWidth: 390 }));
  await browser.close();
})();
