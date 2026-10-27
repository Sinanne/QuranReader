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
      html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      #root > div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      /* Enable smooth momentum touch scrolling on mobile Web */
      div[style*="overflow"] {
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: contain;
      }
    </style>
    `;
    if (!html.includes('mobile-scroll-fix')) {
        html = html.replace('</head>', `${scrollStyles}\n</head>`);
        fs.writeFileSync(indexHtmlPath, html);
        console.log('[fix-web] Added mobile-scroll-fix to index.html');
    }
}
