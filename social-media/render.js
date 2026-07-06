#!/usr/bin/env node
/* ============================================================
   Suncoast Senior Living — Flyer renderer
   Renders every flyer HTML in a content month to a PNG.

   Usage:
     node social-media/render.js                 # newest month in content/
     node social-media/render.js 2026-07         # a specific month
     node social-media/render.js content/2026-07 # or a path

   Each flyer's <div class="canvas"> is captured at 2x for crisp,
   print-ready, post-ready PNGs written to <month>/exports/.
   Uses the pre-installed Chromium (no browser download).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = __dirname;
const CONTENT = path.join(ROOT, 'content');

function findChromium() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
    return process.env.CHROMIUM_PATH;
  }
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    const dir = fs.readdirSync(base).find((d) => d.startsWith('chromium-'));
    if (dir) {
      const exe = path.join(base, dir, 'chrome-linux', 'chrome');
      if (fs.existsSync(exe)) return exe;
    }
  } catch (_) { /* fall through */ }
  return undefined; // let playwright try its default
}

function resolveMonthDir(arg) {
  if (arg) {
    const direct = path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg);
    if (fs.existsSync(direct)) return direct;
    const inContent = path.join(CONTENT, arg);
    if (fs.existsSync(inContent)) return inContent;
    throw new Error(`Month not found: ${arg}`);
  }
  const months = fs.readdirSync(CONTENT)
    .filter((d) => /^\d{4}-\d{2}$/.test(d))
    .sort();
  if (!months.length) throw new Error('No content/<YYYY-MM> folders found.');
  return path.join(CONTENT, months[months.length - 1]);
}

(async () => {
  const monthDir = resolveMonthDir(process.argv[2]);
  const flyersDir = path.join(monthDir, 'flyers');
  const exportsDir = path.join(monthDir, 'exports');
  fs.mkdirSync(exportsDir, { recursive: true });

  const files = fs.readdirSync(flyersDir).filter((f) => f.endsWith('.html')).sort();
  if (!files.length) { console.error('No .html flyers in', flyersDir); process.exit(1); }

  const executablePath = findChromium();
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--force-color-profile=srgb'] });

  console.log(`Rendering ${files.length} flyers from ${path.relative(ROOT, monthDir)}`);
  for (const file of files) {
    const page = await browser.newPage({ deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(flyersDir, file), { waitUntil: 'networkidle' });
    const canvas = await page.$('.canvas');
    if (!canvas) { console.warn('  ! no .canvas in', file); await page.close(); continue; }
    const out = path.join(exportsDir, file.replace(/\.html$/, '.png'));
    await canvas.screenshot({ path: out });
    console.log('  ✓', path.basename(out));
    await page.close();
  }

  await browser.close();
  console.log(`\nDone. PNGs in ${path.relative(ROOT, exportsDir)}/`);
})().catch((e) => { console.error('Render failed:', e.message); process.exit(1); });
