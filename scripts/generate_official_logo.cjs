const { chromium } = require('/root/.bun/install/global/node_modules/playwright-core');
const fs = require('fs');

async function generate() {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // HTML with Poppins font loaded from Google Fonts and the official VagouApp checkmark + wordmark
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      padding: 12px 20px;
      background: transparent;
    }
    .wordmark {
      font-family: 'Poppins', sans-serif;
      font-weight: 800;
      font-size: 54px;
      line-height: 1;
      letter-spacing: -0.03em;
      display: flex;
      align-items: baseline;
    }
    .vagou {
      color: #FFFFFF;
    }
    .app {
      color: #20C933;
    }
  </style>
</head>
<body>
  <div class="logo-container" id="logo">
    <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vGrad" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stop-color="#087A2A" />
          <stop offset="45%" stop-color="#20C933" />
          <stop offset="100%" stop-color="#38E54B" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#20C933" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M 18 50 C 14 44 22 36 29 42 L 44 58 C 47 61 52 61 55 57 L 85 20 C 90 14 98 20 94 27 L 55 78 C 50 85 41 85 36 79 L 18 50 Z" 
            fill="url(#vGrad)" 
            filter="url(#glow)"/>
    </svg>
    <div class="wordmark">
      <span class="vagou">vagou</span><span class="app">app</span>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  // Wait for Poppins font to be fully loaded
  await page.evaluateHandle('document.fonts.ready');
  
  const element = await page.$('#logo');
  if (element) {
    await element.screenshot({
      path: '/public/logo.png',
      omitBackground: true
    });
    // Also save copy to src/assets/logo.png
    fs.copyFileSync('/public/logo.png', '/src/assets/logo.png');
    console.log('Successfully generated /public/logo.png and /src/assets/logo.png');
  } else {
    console.error('Element #logo not found');
  }

  await browser.close();
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
