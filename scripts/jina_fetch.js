// Quick helper: fetch a URL via Jina Reader and save to a file
// Usage: node scripts/jina_fetch.js <url> <outputFile>
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const [,, url, outFile] = process.argv;
if (!url) { console.error('Usage: node scripts/jina_fetch.js <url> <outputFile>'); process.exit(1); }

const jinaUrl = `https://r.jina.ai/${url}`;
console.log('Fetching via Jina:', jinaUrl);

fetch(jinaUrl, {
  headers: {
    'Accept': 'text/plain',
    'X-Timeout': '20',
    'User-Agent': 'Mozilla/5.0',
  },
  timeout: 30000,
})
  .then(r => r.text())
  .then(text => {
    const saveTo = outFile || path.join('data', 'raw', 'tmp_jina.md');
    fs.mkdirSync(path.dirname(saveTo), { recursive: true });
    fs.writeFileSync(saveTo, text, 'utf8');
    console.log(`Saved ${text.length} chars → ${saveTo}`);
    console.log('\n--- Preview (first 600 chars) ---');
    console.log(text.slice(0, 600));
  })
  .catch(e => console.error('Error:', e.message));
