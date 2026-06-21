const sharp = require('sharp');
const path = require('path');

const logosDir = path.join(__dirname, '../public/images/logos');

const targets = [
  { src: 'KFUPM.svg', dst: 'KFUPM.png', size: 400 },
  { src: 'KAUST.svg', dst: 'KAUST.png', size: 400 },
  { src: 'IUMadinah.svg', dst: 'IUMadinah.png', size: 400 },
];

async function run() {
  for (const t of targets) {
    const srcPath = path.join(logosDir, t.src);
    const dstPath = path.join(logosDir, t.dst);
    try {
      // Get SVG metadata first
      const meta = await sharp(srcPath).metadata();
      console.log(`[${t.src}] ${meta.width}x${meta.height} (${meta.format})`);

      // Render SVG at target width, preserving aspect ratio, on white square canvas
      const rendered = await sharp(srcPath)
        .resize({ width: t.size, height: t.size, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer();

      await sharp(rendered).toFile(dstPath);
      console.log(`  -> Saved ${t.dst}`);
    } catch (e) {
      console.error(`  ERROR on ${t.src}:`, e.message);
    }
  }
  console.log('Done!');
}

run();
