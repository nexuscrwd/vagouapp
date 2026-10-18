const { chromium } = require('/root/.bun/install/global/node_modules/playwright-core');
const fs = require('fs');

async function render() {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 600, deviceScaleFactor: 2 }
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@1,800;1,900&family=Poppins:ital,wght@1,800;1,900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    #logo-frame {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 12px 24px;
      background: transparent;
    }

    .v-symbol-wrapper {
      position: relative;
      width: 86px;
      height: 86px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .v-symbol {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 10px rgba(32, 201, 51, 0.45));
    }

    .brand-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .wordmark-row {
      display: flex;
      align-items: flex-start;
      line-height: 0.88;
      position: relative;
    }

    /* agou solid white typography matching vagou_logo_transparente_texto_branco.png */
    .word-agou {
      font-family: 'Poppins', 'Montserrat', sans-serif;
      font-style: italic;
      font-weight: 900;
      font-size: 66px;
      letter-spacing: -0.035em;
      text-transform: lowercase;
      color: #FFFFFF;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
    }

    /* app superscript in solid green italic */
    .word-app {
      font-family: 'Poppins', 'Montserrat', sans-serif;
      font-style: italic;
      font-weight: 900;
      font-size: 26px;
      color: #20C933;
      letter-spacing: -0.02em;
      text-transform: lowercase;
      margin-left: 2px;
      margin-top: -2px;
      filter: drop-shadow(0 0 8px rgba(32, 201, 51, 0.5));
    }

    /* Vagou achou. tagline */
    .tagline-row {
      font-family: 'Poppins', 'Montserrat', sans-serif;
      font-style: italic;
      font-weight: 800;
      font-size: 19px;
      color: #20C933;
      letter-spacing: 0.015em;
      margin-top: 6px;
      filter: drop-shadow(0 0 6px rgba(32, 201, 51, 0.35));
    }

    #icon-frame {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: transparent;
    }
  </style>
</head>
<body>
  <div id="logo-frame">
    <div class="v-symbol-wrapper">
      <svg class="v-symbol" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vGrad" x1="10%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stop-color="#087A2A" />
            <stop offset="48%" stop-color="#20C933" />
            <stop offset="100%" stop-color="#38E54B" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" flood-color="#20C933" flood-opacity="0.5"/>
          </filter>
        </defs>
        <!-- Gradient checkmark fill -->
        <path d="M 18 50 C 13 43 23 35 30 42 L 44 58 C 47 61 52 61 55 57 L 86 19 C 91 13 99 20 95 27 L 55 79 C 50 86 41 86 36 79 L 18 50 Z" 
              fill="url(#vGrad)" 
              filter="url(#glow)"/>
      </svg>
    </div>

    <div class="brand-content">
      <div class="wordmark-row">
        <span class="word-agou">agou</span>
        <span class="word-app">app</span>
      </div>
      <div class="tagline-row">
        Vagou achou.
      </div>
    </div>
  </div>

  <div id="icon-frame">
    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vGradIcon" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stop-color="#087A2A" />
          <stop offset="48%" stop-color="#20C933" />
          <stop offset="100%" stop-color="#38E54B" />
        </linearGradient>
      </defs>
      <!-- White contour for checkmark -->
      <path d="M 18 50 C 13 43 23 35 30 42 L 44 58 C 47 61 52 61 55 57 L 86 19 C 91 13 99 20 95 27 L 55 79 C 50 86 41 86 36 79 L 18 50 Z" 
            fill="none" 
            stroke="#FFFFFF" 
            stroke-width="5" 
            stroke-linejoin="round"
            stroke-linecap="round"/>
      <path d="M 18 50 C 13 43 23 35 30 42 L 44 58 C 47 61 52 61 55 57 L 86 19 C 91 13 99 20 95 27 L 55 79 C 50 86 41 86 36 79 L 18 50 Z" 
            fill="url(#vGradIcon)"/>
    </svg>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluateHandle('document.fonts.ready');

  const logoEl = await page.$('#logo-frame');
  if (logoEl) {
    await logoEl.screenshot({
      path: 'public/logo.png',
      omitBackground: true
    });
    fs.copyFileSync('public/logo.png', 'src/assets/logo.png');
    console.log('Successfully saved to public/logo.png and src/assets/logo.png');
  }

  const iconEl = await page.$('#icon-frame');
  if (iconEl) {
    await iconEl.screenshot({
      path: 'public/logo-icon.png',
      omitBackground: true
    });
    fs.copyFileSync('public/logo-icon.png', 'src/assets/logo-icon.png');
    console.log('Successfully saved to public/logo-icon.png and src/assets/logo-icon.png');
  }

  await browser.close();
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});
