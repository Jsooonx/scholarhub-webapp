const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const nextDir = path.join(rootDir, '.next');
const publicDir = path.join(rootDir, 'public');

console.log('📦 Preparing static assets for Cloudflare deployment...');

// 1. Reset dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest, skipDirs = []) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((child) => {
      if (skipDirs.includes(child)) {
        console.log(`  ⏭ Skipping directory: ${path.join(src, child)}`);
        return;
      }
      copyRecursiveSync(path.join(src, child), path.join(dest, child), []);
    });
  } else {
    // Skip files larger than 24 MiB (Cloudflare limit is 25 MiB)
    if (stats.size > 24 * 1024 * 1024) {
      console.log(`  ⚠ Skipping oversized file (${(stats.size / 1024 / 1024).toFixed(1)} MiB): ${path.basename(src)}`);
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy public directory to dist root
//    - Include everything EXCEPT /images/universities/ (244 MB of raw PNGs)
//    - The optimized WebP versions are already in /images-optimized/universities/
if (fs.existsSync(publicDir)) {
  const publicEntries = fs.readdirSync(publicDir);
  for (const entry of publicEntries) {
    const srcPath = path.join(publicDir, entry);
    const destPath = path.join(distDir, entry);

    if (entry === 'images') {
      // Copy /images/ but skip the huge /images/universities/ subfolder
      copyRecursiveSync(srcPath, destPath, ['universities']);
    } else {
      copyRecursiveSync(srcPath, destPath);
    }
  }
  console.log('✓ Copied public assets (skipped /images/universities/ raw PNGs)');
}

// 3. Copy .next/static to dist/_next/static
const nextStaticDir = path.join(nextDir, 'static');
const distNextStaticDir = path.join(distDir, '_next', 'static');
if (fs.existsSync(nextStaticDir)) {
  copyRecursiveSync(nextStaticDir, distNextStaticDir);
  console.log('✓ Copied _next/static bundles');
}

// 4. Copy .next/server/app HTML files
const serverAppDir = path.join(nextDir, 'server', 'app');

function copyHtmlFiles(dir, relativeBase = '') {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== '_global-error' && !entry.name.endsWith('.segments')) {
        copyHtmlFiles(fullPath, path.join(relativeBase, entry.name));
      }
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.html')) {
        if (entry.name === 'index.html' && relativeBase === '') {
          fs.copyFileSync(fullPath, path.join(distDir, 'index.html'));
        } else if (entry.name === '_not-found.html') {
          fs.copyFileSync(fullPath, path.join(distDir, '404.html'));
        } else {
          const baseName = entry.name.replace(/\.html$/, '');
          const destHtml = path.join(distDir, relativeBase, `${baseName}.html`);
          const destIndex = path.join(distDir, relativeBase, baseName, 'index.html');

          fs.mkdirSync(path.dirname(destHtml), { recursive: true });
          fs.copyFileSync(fullPath, destHtml);

          fs.mkdirSync(path.dirname(destIndex), { recursive: true });
          fs.copyFileSync(fullPath, destIndex);
        }
      } else if (entry.name === 'robots.txt.body') {
        fs.copyFileSync(fullPath, path.join(distDir, 'robots.txt'));
      } else if (entry.name === 'sitemap.xml.body') {
        fs.copyFileSync(fullPath, path.join(distDir, 'sitemap.xml'));
      }
    }
  }
}

if (fs.existsSync(serverAppDir)) {
  copyHtmlFiles(serverAppDir);
  console.log('✓ Extracted and formatted Next.js HTML pages');
}

// 5. Print total dist size
let totalSize = 0;
let fileCount = 0;
function countSize(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      countSize(fullPath);
    } else {
      totalSize += fs.statSync(fullPath).size;
      fileCount++;
    }
  }
}
countSize(distDir);
console.log(`✨ All assets prepared: ${fileCount} files, ${(totalSize / 1024 / 1024).toFixed(1)} MiB total in ./dist`);
