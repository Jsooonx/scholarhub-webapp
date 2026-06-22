const fs = require('fs');
const c = fs.readFileSync('scripts/reextract.js', 'utf8');


const hkTarget = "    source_file: null,\n  },\n];\n\n// ── Hong Kong (HKPFS)";

const hkEntry = "'admissions.hku.hk'";
const hkEnd = c.indexOf(hkEntry);
console.log('HK entry found at:', hkEnd);
if (hkEnd > -1) {
  // Show the text 50 chars after the hkEntry
  const after = c.substring(hkEnd + hkEntry.length, hkEnd + hkEntry.length + 30);
  console.log('After HK entry:', JSON.stringify(after));
}
