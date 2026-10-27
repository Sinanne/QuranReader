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
    <style id="mobile-scroll-fix">
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
      }
      #root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      #root > div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      /* Force native touch drag & momentum scrolling for all scroll containers */
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
    html = html.replace('</head>', `${scrollStyles}\n</head>`);
    fs.writeFileSync(indexHtmlPath, html);
    console.log('[fix-web] Injected updated mobile-scroll-fix into index.html');
}
