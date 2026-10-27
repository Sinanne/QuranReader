const fs = require('fs');
const path = require('path');

const webJsDir = path.join(__dirname, '..', 'dist', '_expo', 'static', 'js', 'web');

if (fs.existsSync(webJsDir)) {
    fs.readdirSync(webJsDir).forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(webJsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('import.meta')) {
                content = content.replace(/import\.meta\.env/g, 'process.env');
                content = content.replace(/import\.meta/g, '({})');
                fs.writeFileSync(filePath, content);
                console.log(`[fix-web] Transformed import.meta in ${file}`);
            }
        }
    });
}

// Ensure .nojekyll exists in dist
const nojekyllPath = path.join(__dirname, '..', 'dist', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('[fix-web] Ensured .nojekyll in dist');

// Ensure mobile touch scrolling and viewport styles in index.html
const indexHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');
    const scrollStyles = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <style id="mobile-scroll-fix">
      html, body {
        width: 100%;
        height: 100%;
        height: -webkit-fill-available;
        height: 100dvh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
      }
      #root {
        width: 100%;
        height: 100%;
        height: -webkit-fill-available;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 0 !important;
      }
      #root > div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0 !important;
      }
      /* Ensure all flex wrappers allow shrinking */
      div[class*="r-13awgt0"],
      div[class*="r-flex-13awgt0"] {
        min-height: 0 !important;
      }
      /* React Navigation Scene & Card container web height lock */
      div[class*="r-12vffkv"] > div[class*="r-12vffkv"],
      div[class*="r-1p0dtai"] > div,
      [class*="r-2llsf"], 
      div[style*="rgb(242, 242, 242)"],
      div[style*="background-color: rgb(242, 242, 242)"] {
        height: 100% !important;
        max-height: 100% !important;
        flex: 1 1 100% !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      /* Force native touch drag & momentum scrolling for all scroll containers */
      [class*="r-150rngu"],
      [class*="r-overflowY"], 
      [style*="overflow-y"], 
      [style*="overflow: auto"], 
      [style*="overflow: scroll"],
      div[style*="overflow"] {
        -webkit-overflow-scrolling: touch !important;
        touch-action: pan-y !important;
        overscroll-behavior-y: contain;
      }
      /* Prevent PanGestureHandler from swallowing vertical scroll touches */
      .r-touchAction-1777fci, [style*="touch-action: none"] {
        touch-action: pan-y !important;
      }
    </style>
    `;
    // Clean old mobile-scroll-fix if exists and inject new
    html = html.replace(/<style id="mobile-scroll-fix">[\s\S]*?<\/style>/g, '');
    html = html.replace(/<meta http-equiv="Cache-Control"[\s\S]*?\/>/g, '');
    html = html.replace('</head>', `${scrollStyles}\n</head>`);
    fs.writeFileSync(indexHtmlPath, html);
    console.log('[fix-web] Injected updated mobile-scroll-fix into index.html');
}
