// Renders public/icon.svg to the PNG sizes Android needs for installing the PWA.
// Usage: node scripts/make-icons.cjs   (needs Playwright + Chromium available)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const svg = fs.readFileSync(path.join(__dirname, '../public/icon.svg'), 'utf8');
  const browser = await chromium.launch();
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>*{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
    await page.screenshot({ path: path.join(__dirname, `../public/icon-${size}.png`), omitBackground: true });
  }
  await browser.close();
})();
