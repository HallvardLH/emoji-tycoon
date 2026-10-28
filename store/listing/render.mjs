/**
 * Renders the store images with headless Chrome.
 *
 *   node store/listing/render.mjs                         every language and device in config.json
 *   node store/listing/render.mjs --lang nb --device tablet --slides 1,3
 *
 * Writes out/<lang>/<device>/NN_<slide>.png, out/<lang>/feature-graphic.png and
 * out/<lang>/overview.png (everything for that language on one sheet, for checking).
 * Set CHROME to the browser's path if it isn't found.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const storeDir = dirname(here);
const config = JSON.parse(readFileSync(join(here, "config.json"), "utf8"));

const args = Object.fromEntries(process.argv.slice(2).join(" ").split("--").filter(Boolean).map(a => { const [key, ...values] = a.trim().split(/\s+/); return [key, values]; }));
const langs = args.lang?.[0]?.split(",") ?? config.languages;
const devices = args.device?.[0]?.split(",") ?? Object.keys(config.devices);
const slideNumbers = args.slides?.[0]?.split(",").map(Number) ?? config.slides.map((_, i) => i + 1);

function findChrome() {
  const candidates = [
    process.env.CHROME,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
  ];
  const found = candidates.find(c => c && existsSync(c));
  if (!found) throw new Error("No Chrome found; set CHROME to its path");
  return found;
}
const chrome = findChrome();

// The template fetches its JSON, so it's served over http (store/ is the root, for the app icon)
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf" };
const server = createServer((req, res) => {
  const path = normalize(join(storeDir, decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (relative(storeDir, path).startsWith("..") || !existsSync(path)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" }).end(readFileSync(path));
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}/listing`;

const shoot = (url, file, [w, h]) => new Promise((resolve, reject) => {
  mkdirSync(dirname(file), { recursive: true });
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=10000", `--window-size=${w},${h}`, `--screenshot=${file}`, url], { stdio: "ignore" });
  p.on("exit", code => code === 0 && existsSync(file) ? resolve() : reject(new Error(`Chrome failed on ${url}`)));
});

// A few Chromes at a time
async function runAll(jobs, limit = 4) {
  const queue = [...jobs];
  await Promise.all(Array.from({ length: limit }, async () => { while (queue.length) await queue.shift()(); }));
}

const missing = [];
for (const lang of langs) {
  if (!existsSync(join(here, "i18n", `${lang}.json`))) { console.warn(`No i18n/${lang}.json, skipping ${lang}`); continue; }
  const out = join(here, "out", lang);
  const jobs = [() => shoot(`${base}/template.html?lang=${lang}&fg`, join(out, "feature-graphic.png"), [1024, 500])];
  for (const device of devices) {
    const size = config.devices[device].size;
    // A full render starts clean, so renamed slides leave nothing stale behind
    if (!args.slides) rmSync(join(out, device), { recursive: true, force: true });
    for (const n of slideNumbers) {
      const slide = config.slides[n - 1];
      if (slide.capture) {
        const own = join(here, "captures", device, lang, `${slide.capture}.png`);
        const english = join(here, "captures", device, "en", `${slide.capture}.png`);
        if (!existsSync(own)) missing.push(`${device}/${lang}/${slide.capture}.png${existsSync(english) ? " (using en)" : ""}`);
      }
      const file = join(out, device, `${String(n).padStart(2, "0")}_${slide.id}.png`);
      jobs.push(() => shoot(`${base}/template.html?device=${device}&lang=${lang}&slide=${n}`, file, size));
    }
  }
  await runAll(jobs);
  await shoot(`${base}/overview.html?lang=${lang}&devices=${devices.join(",")}`, join(out, "overview.png"), [2400, 680 * devices.length + 520]);
  console.log(`${lang}: ${readdirSync(out, { recursive: true }).filter(f => f.endsWith(".png")).length} images in ${out}`);
}
server.close();

if (missing.length) {
  console.log(`\nMissing captures (placeholders drawn where there is no English one either):\n  ${[...new Set(missing)].join("\n  ")}`);
  console.log("Take them with: node store/listing/capture.mjs --device <device> --lang <lang>");
}
