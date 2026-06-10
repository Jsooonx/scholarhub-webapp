/**
 * ScholarHub Crawler — Auto-discover mode
 *
 * Crawls a scholarship provider website starting from a root URL.
 * Follows internal links that match a relevance filter, converts
 * each page to clean Markdown, and saves them to data/raw/<provider>/.
 *
 * Usage:
 *   node scripts/crawl.js <rootUrl> <providerName> [options]
 *
 * Examples:
 *   node scripts/crawl.js https://www.chevening.org/scholarships chevening
 *   node scripts/crawl.js https://www.australiaawardsindonesia.org/content/2/about-australia-awards australia-awards --depth 2
 *   node scripts/crawl.js https://www.turkiyeburslari.gov.tr turkiye --keywords "scholarship,program,apply,eligibility"
 *
 * Options:
 *   --depth <n>        Max link-follow depth (default: 3)
 *   --keywords <list>  Comma-separated path keywords to follow (default: see DEFAULTS)
 *   --delay <ms>       Delay between requests in ms (default: 800)
 *   --max <n>          Max pages to crawl (default: 50)
 *   --dry-run          Print discovered URLs without saving
 */

const fetch = require('node-fetch');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ── Config defaults ──────────────────────────────────────────────────────────

const DEFAULTS = {
  maxDepth: 3,
  maxPages: 50,
  delayMs: 800,
  // Path segments that indicate a relevant page — customise per provider
  relevantKeywords: [
    'scholarship', 'scholarships',
    'eligibility', 'eligible',
    'apply', 'application', 'how-to-apply',
    'programme', 'program',
    'timeline', 'deadline', 'dates',
    'benefits', 'what-we-offer', 'funding',
    'requirements', 'requirement',
    'about', 'faq',
    'award', 'awards',
    'grant', 'grants',
    'fellowship', 'fellowships',
    'study', 'graduate', 'undergraduate', 'postgraduate',
  ],
  // Path segments that should NEVER be followed
  blockKeywords: [
    'news', 'blog', 'press', 'media',
    'events', 'event',
    'careers', 'jobs', 'vacancies',
    'alumni', 'stories', 'profiles',
    'contact', 'privacy', 'cookie', 'terms',
    'login', 'register', 'account',
    'search', 'tag', 'category',
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
    '#', 'mailto:', 'tel:',
    '?p=',   // WordPress pagination/preview links
    '/page/', // paginated archive pages
    '/wp-',  // WordPress admin paths
  ],
};

// ── CLI argument parsing ─────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/crawl.js <rootUrl> <providerName> [options]');
    console.error('Example: node scripts/crawl.js https://www.chevening.org/scholarships chevening');
    process.exit(1);
  }

  const rootUrl = args[0];
  const providerName = args[1].toLowerCase().replace(/\s+/g, '-');
  const opts = {
    maxDepth: DEFAULTS.maxDepth,
    maxPages: DEFAULTS.maxPages,
    delayMs: DEFAULTS.delayMs,
    relevantKeywords: [...DEFAULTS.relevantKeywords],
    dryRun: false,
  };

  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--depth' && args[i + 1]) opts.maxDepth = parseInt(args[++i]);
    if (args[i] === '--max' && args[i + 1]) opts.maxPages = parseInt(args[++i]);
    if (args[i] === '--delay' && args[i + 1]) opts.delayMs = parseInt(args[++i]);
    if (args[i] === '--dry-run') opts.dryRun = true;
    if (args[i] === '--keywords' && args[i + 1]) {
      opts.relevantKeywords = args[++i].split(',').map(k => k.trim());
    }
  }

  return { rootUrl, providerName, opts };
}

// ── URL helpers ──────────────────────────────────────────────────────────────

function normalizeUrl(href, base) {
  try {
    const u = new URL(href, base);
    // Strip fragment and trailing slash for deduplication
    u.hash = '';
    let normalized = u.href;
    if (normalized.endsWith('/') && normalized !== u.origin + '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return null;
  }
}

function isRelevant(urlStr, baseDomain, keywords, blockList, rootPathname) {
  try {
    const u = new URL(urlStr);
    // Must be same domain
    if (u.hostname !== baseDomain) return false;
    // Block query strings like ?p=1580 (WordPress previews)
    if (u.search && /[?&]p=\d/.test(u.search)) return false;
    // Must not match block list
    const full = u.pathname.toLowerCase() + u.search.toLowerCase();
    if (blockList.some(b => full.includes(b))) return false;
    // Root path only allowed if it IS the starting path
    const pathname = u.pathname.replace(/\/$/, '') || '/';
    if (pathname === '' || pathname === '/') return pathname === rootPathname;
    // Must share the root path prefix OR match a relevant keyword
    const underRoot = rootPathname !== '/' && pathname.startsWith(rootPathname);
    const hasKeyword = keywords.some(k => pathname.toLowerCase().includes(k));
    return underRoot || hasKeyword;
  } catch {
    return false;
  }
}

// ── HTML → Markdown ──────────────────────────────────────────────────────────

const td = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

// Remove nav, footer, scripts, styles, ads
td.remove(['script', 'style', 'nav', 'footer', 'header', 'aside', 'form', 'iframe', 'noscript', 'svg', 'button']);

// Strip images but keep alt text context
td.addRule('images', {
  filter: 'img',
  replacement: (_, node) => {
    const alt = node.getAttribute('alt');
    return alt ? `[image: ${alt}]` : '';
  },
});

function htmlToMarkdown(html, pageUrl) {
  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : pageUrl;

  // Extract main content — prefer <main>, <article>, or <body>
  let content = html;
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (mainMatch) content = mainMatch[1];
  else if (articleMatch) content = articleMatch[1];

  const markdown = td.turndown(content);

  // Clean up excessive blank lines
  const cleaned = markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\[image:[^\]]*\]\s*/g, '')
    .trim();

  return { title, markdown: cleaned };
}

// ── File output ──────────────────────────────────────────────────────────────

function urlToFilename(urlStr, index) {
  try {
    const u = new URL(urlStr);
    const slug = u.pathname
      .replace(/^\/|\/$/g, '')
      .replace(/\//g, '_')
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'index';
    return `${String(index).padStart(2, '0')}_${slug}.md`;
  } catch {
    return `${String(index).padStart(2, '0')}_page.md`;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  Created directory: ${dirPath}`);
  }
}

// ── Delay helper ─────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ── Main crawler ─────────────────────────────────────────────────────────────

async function crawl(rootUrl, providerName, opts) {
  const rootParsed = new URL(rootUrl);
  const baseDomain = rootParsed.hostname;
  const outputDir = path.join(__dirname, '..', 'data', 'raw', providerName);

  console.log('\n🕷  ScholarHub Crawler');
  console.log(`   Provider : ${providerName}`);
  console.log(`   Root URL : ${rootUrl}`);
  console.log(`   Domain   : ${baseDomain}`);
  console.log(`   Max depth: ${opts.maxDepth}`);
  console.log(`   Max pages: ${opts.maxPages}`);
  console.log(`   Dry run  : ${opts.dryRun}`);
  console.log(`   Output   : ${outputDir}\n`);

  if (!opts.dryRun) ensureDir(outputDir);

  // BFS queue: { url, depth }
  const queue = [{ url: normalizeUrl(rootUrl, rootUrl), depth: 0 }];
  const visited = new Set();
  const saved = [];
  let pageIndex = 1;
  const rootPathname = rootParsed.pathname.replace(/\/$/, '') || '/';

  while (queue.length > 0 && saved.length < opts.maxPages) {
    const { url, depth } = queue.shift();

    if (!url || visited.has(url)) continue;
    visited.add(url);

    console.log(`[${saved.length + 1}/${opts.maxPages}] depth=${depth} ${url}`);

    // ── Fetch ──────────────────────────────────────────────────────────────
    let html;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ScholarHubBot/1.0; +https://scholarhub.app)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 15000,
      });

      if (!res.ok) {
        console.log(`   ⚠ HTTP ${res.status} — skipping`);
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        console.log(`   ⚠ Non-HTML content type — skipping`);
        continue;
      }

      html = await res.text();
    } catch (err) {
      console.log(`   ✗ Fetch error: ${err.message}`);
      continue;
    }

    // ── Convert to Markdown ────────────────────────────────────────────────
    const { title, markdown } = htmlToMarkdown(html, url);

    if (markdown.length < 100) {
      console.log(`   ⚠ Content too short (${markdown.length} chars) — skipping`);
    } else {
      const filename = urlToFilename(url, pageIndex++);
      const fileContent = `---\nurl: "${url}"\ntitle: "${title.replace(/"/g, '\\"')}"\ncrawled: "${new Date().toISOString().split('T')[0]}"\n---\n\n${markdown}\n`;

      if (opts.dryRun) {
        console.log(`   → [dry-run] would save: ${filename} (${markdown.length} chars)`);
      } else {
        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`   ✓ Saved: ${filename} (${markdown.length} chars)`);
      }

      saved.push({ url, filename, chars: markdown.length });
    }

    // ── Discover links (only if not at max depth) ──────────────────────────
    if (depth < opts.maxDepth) {
      const linkRegex = /href=["']([^"']+)["']/gi;
      let match;
      let discovered = 0;

      while ((match = linkRegex.exec(html)) !== null) {
        const normalized = normalizeUrl(match[1], url);
        if (
          normalized &&
          !visited.has(normalized) &&
          isRelevant(normalized, baseDomain, opts.relevantKeywords, DEFAULTS.blockKeywords, rootPathname)
        ) {
          queue.push({ url: normalized, depth: depth + 1 });
          discovered++;
        }
      }

      if (discovered > 0) console.log(`   → Queued ${discovered} new links`);
    }

    // ── Polite delay ───────────────────────────────────────────────────────
    if (queue.length > 0) await sleep(opts.delayMs);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log(`✓ Crawl complete`);
  console.log(`  Pages saved : ${saved.length}`);
  console.log(`  URLs visited: ${visited.size}`);
  if (!opts.dryRun && saved.length > 0) {
    console.log(`  Output dir  : ${outputDir}`);
    console.log('\n  Files saved:');
    saved.forEach(s => console.log(`    ${s.filename}  (${s.chars} chars)  ${s.url}`));
    console.log('\n  Next step: update scripts/reextract.js with the new data, then run:');
    console.log('    node scripts/reextract.js');
  }
  console.log('─────────────────────────────────────────\n');
}

// ── Run ───────────────────────────────────────────────────────────────────────

const { rootUrl, providerName, opts } = parseArgs();
crawl(rootUrl, providerName, opts).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
