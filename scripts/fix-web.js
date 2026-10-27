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
