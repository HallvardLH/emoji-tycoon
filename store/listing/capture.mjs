/**
 * Guided screenshots from an Android emulator (or phone) for the store images.
 *
 *   node store/listing/capture.mjs --device phone --lang en
 *   node store/listing/capture.mjs --device tablet --lang nb --only home,shop --serial emulator-5556
 *
 * Walks through config.json's captures: shows the moment to set up and how, waits for Enter,
 * then takes the screenshot. Action shots ("burst" > 1) take several in a row so you can keep
 * the best one. The status bar is put in demo mode (12:00, full battery, no notifications)
 * while capturing. Saves to captures/<device>/<lang>/<name>.png.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, "config.json"), "utf8"));

const args = Object.fromEntries(process.argv.slice(2).join(" ").split("--").filter(Boolean).map(a => { const [key, ...values] = a.trim().split(/\s+/); return [key, values]; }));
const device = args.device?.[0] ?? "phone";
const lang = args.lang?.[0] ?? "en";
const only = args.only?.[0]?.split(",");
if (!config.devices[device]) throw new Error(`Unknown device "${device}", config.json has: ${Object.keys(config.devices).join(", ")}`);

function findAdb() {
  if (process.env.ADB) return process.env.ADB;
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || (process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Android", "Sdk"));
  const exe = sdk && join(sdk, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb");
  return exe && existsSync(exe) ? exe : "adb";
}
const adbPath = findAdb();
const adb = (...a) => execFileSync(adbPath, [...(args.serial ? ["-s", args.serial[0]] : []), ...a], { maxBuffer: 64 * 1024 * 1024 });
const screencap = () => adb("exec-out", "screencap", "-p");
const demo = (command, extras = []) => adb("shell", "am", "broadcast", "-a", "com.android.systemui.demo", "-e", "command", command, ...extras);

function demoMode(on) {
  try {
    if (!on) return demo("exit");
    adb("shell", "settings", "put", "global", "sysui_demo_allowed", "1");
    demo("enter");
    demo("clock", ["-e", "hhmm", "1200"]);
    demo("battery", ["-e", "level", "100", "-e", "plugged", "false"]);
    demo("network", ["-e", "wifi", "show", "-e", "level", "4"]);
    demo("network", ["-e", "mobile", "hide"]);
    demo("notifications", ["-e", "visible", "false"]);
  } catch {
    console.warn("Could not switch the status bar's demo mode; captures will show the real status bar.");
  }
}

const outDir = join(here, "captures", device, lang);
const burstDir = join(outDir, "burst");
mkdirSync(burstDir, { recursive: true });

const rl = createInterface({ input: process.stdin, output: process.stdout });
console.log(`Capturing ${device} / ${lang} with ${adbPath}`);
const [w, h] = adb("shell", "wm", "size").toString().match(/(\d+)x(\d+)/)?.slice(1).map(Number) ?? [];
if (w) console.log(`Screen ${w}x${h}${device === "tablet" && w > h ? " - landscape; turn the tablet to portrait" : ""}`);
demoMode(true);

try {
  for (const [name, shot] of Object.entries(config.captures)) {
    if (only && !only.includes(name)) continue;
    const target = join(outDir, `${name}.png`);
    console.log(`\n━━ ${name}${existsSync(target) ? " (replaces the current one)" : ""}\n${shot.moment}`);
    shot.setup?.forEach(step => console.log(`  • ${step}`));
    const answer = await rl.question(shot.burst > 1 ? `Enter starts a burst of ${shot.burst} (s skips) ` : "Enter captures (s skips) ");
    if (answer.trim() === "s") continue;

    if (!(shot.burst > 1)) {
      writeFileSync(target, screencap());
      console.log(`Saved ${target}`);
      continue;
    }
    const files = [];
    for (let i = 1; i <= shot.burst; i++) {
      const file = join(burstDir, `${name}_${i}.png`);
      writeFileSync(file, screencap());
      files.push(file);
      process.stdout.write(`${i} `);
    }
    console.log(`\nBurst saved in ${burstDir}. Look through ${name}_1 to ${name}_${shot.burst}.`);
    const pick = Number(await rl.question(`Keep which one? [1-${shot.burst}] `)) || 1;
    copyFileSync(files[Math.min(Math.max(pick, 1), files.length) - 1], target);
    console.log(`Saved ${target}`);
  }
} finally {
  demoMode(false);
  rl.close();
}
console.log(`\nDone. Render with: node store/listing/render.mjs --device ${device} --lang ${lang}`);
