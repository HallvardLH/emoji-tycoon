/**
 * Layouts for the store images ("Pop" style): a loud gradient per slide, sun rays and confetti,
 * a big caption and a tilted device showing a real capture from the emulator.
 *
 * Nothing in here is language or device specific. Text comes from i18n/<lang>.json; the canvas
 * size, the device frame and everything that depends on a capture come from config.json.
 *
 * Every slide is laid out 1080 units wide and as tall as the device's aspect ratio makes it
 * (1920 for a 9:16 phone), then scaled up to the device's output size. Things near the bottom
 * are placed from the bottom (ctx.H - n), so they hold on any aspect ratio.
 */

const BUILDINGS = ["✍️","🎨","🌽","🍽️","🦒","🏭","🏈","🎬","🏦","🎢","🏛️","✈️","🛰️","🍭","🌋","🏯","🖥️","🕳️","⚛️","🕰️","💥","🌀","🙂"];
const CONFETTI = ["#FFC53D", "#FFFFFF", "#FF5C7A", "#2EC4B6", "#8338EC"];
const ICON = "../play-store-icon-512.png";
const W = 1080;

/* ---------- Data ---------- */

function makeContext(config, strings, lang, deviceName) {
  const device = config.devices[deviceName];
  const locale = strings.locale || lang;
  const number = new Intl.NumberFormat(locale);
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const escape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Translator markup: [word] is highlighted, \n breaks the line, {name} is a number from config.json
  const text = s => escape(s ?? "")
    .replace(/\{(\w+)\}/g, (_, key) => key in config.numbers ? number.format(config.numbers[key]) : `{${key}}`)
    .replace(/\[([^\]]+)\]/g, '<span class="hl">$1</span>')
    .replace(/\n/g, "<br>");
  return {
    config, strings, lang, deviceName, device, text,
    // Popping numbers: a number is shortened for the locale (3.1B), text is used as written (36.2 Qi)
    pop: v => typeof v === "string" ? text(v) : compact.format(v),
    H: Math.round(W * device.size[1] / device.size[0]),
    scale: device.size[0] / W,
  };
}

/**
 * The capture for this device and language, else the English one, else null (drawn as a
 * placeholder). Along with it comes the tuning in its folder's tune.json, if any: where things
 * are in those captures and what numbers they show, by slide id.
 */
function loadCapture(name, lang, device) {
  const tryLoad = dir => new Promise(resolve => {
    const img = new Image();
    img.onload = async () => {
      const tune = await fetch(`${dir}/tune.json`).then(r => r.ok ? r.json() : {}).catch(() => ({}));
      resolve({ src: img.src, w: img.naturalWidth, h: img.naturalHeight, tune });
    };
    img.onerror = () => resolve(null);
    img.src = `${dir}/${name}.png`;
  });
  return tryLoad(`captures/${device}/${lang}`)
    .then(c => c || (lang === "en" ? null : tryLoad(`captures/${device}/en`)));
}

/* ---------- Building blocks ---------- */

const e = (ch, x, y, size, rot = 0) =>
  `<span class="deco e" style="left:${x}px;top:${y}px;font-size:${size}px;transform:rotate(${rot}deg)">${ch}</span>`;
const glow = (x, y, r, c) =>
  `<div class="abs" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle, ${c} 0%, transparent 70%)"></div>`;
const ring = (cx, cy, r, o) =>
  `<div class="abs" style="left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:8px solid rgba(255,255,255,${o})"></div>`;
/** A sticker-like word or number; data-fit keeps it on the slide whatever the language */
const pop = (html, x, y, size, rot, color = "#FFC53D") =>
  `<div class="abs title" data-fit="slide" style="left:${x}px;top:${y}px;font-size:${size}px;color:${color};white-space:nowrap;-webkit-text-stroke:10px #1C1233;text-shadow:0 8px 0 #1C1233;transform:rotate(${rot}deg)">${html}</div>`;

/** Caption and subtitle, stacked so a long translation pushes nothing into anything */
const head = (ctx, s) =>
  `<div class="abs" style="left:40px;right:40px;top:80px;display:flex;flex-direction:column;align-items:center;gap:30px">
    <div class="title" data-fit="width" style="font-size:128px;max-width:100%;transform:rotate(-2deg)">${ctx.text(s.title)}</div>
    <div class="sub" data-fit="lines" data-lines="2" style="max-width:100%;background:rgba(28,18,51,.32);border-radius:999px;padding:14px 40px">${ctx.text(s.subtitle)}</div>
  </div>`;

// Small deterministic random, so every render of a slide looks the same
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** Sun rays, a glow behind the device, darker edges, confetti in the margins and sparkles */
function backdrop(ctx, i, cy = 1150) {
  const r = rnd(i * 97 + 13);
  let s = `<div class="abs" style="left:-600px;top:${cy - 1300}px;width:2280px;height:2600px;background:repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.1) 0deg 7deg, transparent 7deg 14deg)"></div>`
        + glow(540, cy, 700, "rgba(255,255,255,.3)")
        + `<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,0,0,.22) 100%)"></div>`;
  for (let k = 0; k < 26; k++) {
    const side = k % 2 ? 940 + r() * 120 : r() * 140, x = k % 5 === 0 ? r() * W : side, y = 520 + r() * (ctx.H - 520);
    s += `<div class="abs" style="left:${x}px;top:${y}px;width:${14 + r() * 10}px;height:${28 + r() * 16}px;border-radius:6px;background:${CONFETTI[k % 5]};transform:rotate(${r() * 180}deg);opacity:.9"></div>`;
  }
  for (let k = 0; k < 12; k++)
    s += `<div class="abs" style="left:${r() * (W - 40)}px;top:${r() * (ctx.H - 40)}px;color:#fff;font-size:${26 + r() * 46}px;opacity:${.45 + r() * .5}">✦</div>`;
  return s;
}

/**
 * The screen inside the device frame, in slide units: its width, the shown height, and where a
 * point of the capture (fractions) lands. Devices can trim the top of captures (trimTop, a
 * fraction of the capture's height), e.g. a status bar the app doesn't draw behind.
 */
function screenOf(ctx, capture) {
  const f = ctx.device.frame, trim = ctx.device.trimTop || 0;
  const w = f.width - 2 * f.pad;
  const full = capture ? w * capture.h / capture.w : w * ctx.device.size[1] / ctx.device.size[0];
  return { w, full, trim: capture ? trim * full : 0, h: capture ? full * (1 - trim) : full,
           at: (fx, fy) => [fx * w, fy * full - (capture ? trim * full : 0)] };
}

/**
 * The tilted, glossy device (frame from config.json), running off the bottom of the slide.
 * `overlay(sc)` draws on top of the screen in screen units, so it turns with the device.
 */
function device(ctx, capture, captureName, tilt, overlay = () => "") {
  const f = ctx.device.frame, inner = f.radius - f.pad;
  const sc = screenOf(ctx, capture), { w, h } = sc;
  const screen = capture
    ? `<div style="height:${h}px;overflow:hidden;border-radius:${inner}px"><img src="${capture.src}" style="margin-top:${-sc.trim}px"></div>`
    : `<div class="missing" style="height:${h}px;border-radius:${inner}px"><span class="e" style="font-size:120px">📸</span>
         <div>Capture needed:<br>captures/${ctx.deviceName}/${ctx.lang}/${captureName}.png</div>
         <div style="font-size:34px;opacity:.8">${ctx.config.captures[captureName]?.moment ?? ""}</div></div>`;
  return `<div class="frame" style="left:${f.left}px;top:${f.top}px;width:${f.width}px;padding:${f.pad}px;border-radius:${f.radius}px;transform:rotate(${tilt}deg);box-shadow:0 0 0 10px rgba(255,255,255,.18),0 50px 100px rgba(0,0,0,.45)">
    ${screen}
    <div class="abs" style="left:${f.pad}px;top:${f.pad}px;width:${w}px;height:${h}px;border-radius:${inner}px;background:linear-gradient(125deg, rgba(255,255,255,.16) 0%, transparent 30%)"></div>
    <div class="abs" style="left:${f.pad}px;top:${f.pad}px;width:${w}px;height:${h}px">${overlay(sc)}</div>
  </div>`;
}

/**
 * A magnified piece of the capture as a speech bubble. `crop` is in fractions of the capture
 * ({x, y, w, h}, 0 to 1), so it holds for any emulator resolution.
 */
function callout(ctx, capture, crop, x, width, rot) {
  if (!capture || !crop) return "";
  const height = width * (crop.h * capture.h) / (crop.w * capture.w);
  // Over the spot it magnifies, like a lens, kept on the slide
  const f = ctx.device.frame;
  const middle = f.top + f.pad + screenOf(ctx, capture).at(0, crop.y + crop.h / 2)[1];
  const y = Math.max(600, Math.min(middle - (height + 20) / 2, ctx.H - height - 80));
  const pos = (start, size) => size >= 1 ? 0 : start / (1 - size) * 100;
  return `<div class="abs" style="left:${x + 230}px;top:${y - 22}px;width:54px;height:54px;background:#FBF8FF;border-left:10px solid #FFC53D;border-top:10px solid #FFC53D;transform:rotate(45deg);z-index:2"></div>
    <div class="callout" style="left:${x}px;top:${y}px;width:${width + 20}px;height:${height + 20}px;transform:rotate(${rot}deg);
      background-image:url(${capture.src});background-size:${100 / crop.w}% auto;background-position:${pos(crop.x, crop.w)}% ${pos(crop.y, crop.h)}%;background-origin:content-box"></div>`;
}

/** The 23 buildings as app-style tiles on a dashed path, ending on a gold tile */
function buildingPath(ctx, s) {
  const cols = 5, rows = Math.ceil(BUILDINGS.length / cols), x0 = 170, dx = 185, y0 = 700;
  const dy = Math.min(230, (ctx.H - 300 - y0) / (rows - 1));
  const pts = BUILDINGS.map((_, i) => {
    const row = Math.floor(i / cols), c = row % 2 ? cols - 1 - (i % cols) : i % cols;
    return [x0 + c * dx, y0 + row * dy];
  });
  const last = pts[pts.length - 1];
  let out = `<svg class="abs" style="left:0;top:0" width="${W}" height="${ctx.H}"><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="10" stroke-dasharray="4 22" stroke-linecap="round"/></svg>`
          + glow(last[0], last[1], 220, "rgba(255,197,61,.6)");
  BUILDINGS.forEach((b, i) => {
    const gold = i === BUILDINGS.length - 1, z = gold ? 190 : 140, [x, y] = pts[i];
    out += `<div class="abs" style="left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border-radius:${z * .26}px;background:${gold ? "#FFC53D" : "#FBF8FF"};
      box-shadow:0 10px 0 ${gold ? "#C98A00" : "#BFB2E6"},0 22px 30px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;transform:rotate(${(i % 3 - 1) * 4}deg)">
      <span class="e" style="font-size:${z * .66}px">${b}</span></div>`;
  });
  return out + `<div class="abs" style="left:40px;right:40px;top:${ctx.H - 180}px;text-align:center">
    <span class="sub" data-fit="width" style="display:inline-block;max-width:100%;white-space:nowrap;background:rgba(28,18,51,.32);border-radius:999px;padding:12px 34px;font-size:40px">${ctx.text(s.path)}</span></div>`;
}

/* ---------- Slides, by id in config.json ---------- */

// t: this slide's capture tuning for the current device (config.json slides[].tune.<device>); t.pops overrides the slide's pops
const LAYOUTS = {
  tap: (ctx, s, c, t, cap, i) => {
    const [fx, fy] = t.focus || [.5, .47];
    // Where the Big Emoji lands on the slide, so the pop-outs sit around it on any device
    const f = ctx.device.frame, sc = screenOf(ctx, cap);
    const y = Math.min(f.top + f.pad + sc.at(fx, fy)[1], ctx.H - 250);
    // The sticker goes above the Big Emoji, clear of the app's counter, or else below it
    const above = y - 520, counterEnd = f.top + f.pad + sc.h * .25;
    const stickerY = above >= counterEnd ? above : Math.min(y + 380, ctx.H - 200);
    return backdrop(ctx, i) + head(ctx, s)
      + e("😀", -30, 700, 160, -15) + e("🤑", 930, 860, 160, 12)
      + device(ctx, cap, c.capture, -4, screen => {
          const [x, y] = screen.at(fx, fy);
          return ring(x, y, 330, .35) + ring(x, y, 420, .18) + e("👆", x + 20, y + 80, 190, -18);
        })
      + pop("+" + ctx.pop((t.pops || c.pops)[0]), 600, y - 330, 90, 10) + pop("+" + ctx.pop((t.pops || c.pops)[1]), 200, y - 180, 80, -12, "#fff")
      + pop(ctx.text(s.sticker), 130, stickerY, 96, -6);
  },

  buildings: (ctx, s, c, t, cap, i) => backdrop(ctx, i) + head(ctx, s) + buildingPath(ctx, s),

  shop: (ctx, s, c, t, cap, i) => backdrop(ctx, i) + head(ctx, s)
    + e("🏭", -20, 700, 170, -12) + e("🎢", 910, 760, 170, 10)
    + device(ctx, cap, c.capture, 4)
    + pop("+" + ctx.pop((t.pops || c.pops)[0]), 620, ctx.H - 220, 100, -6),

  upgrades: (ctx, s, c, t, cap, i) => backdrop(ctx, i) + head(ctx, s)
    + e("🧑‍🌾", 905, 700, 170, 10) + e("😩", -25, 760, 160, -10)
    + device(ctx, cap, c.capture, -4)
    + callout(ctx, cap, t.callout, 40, 990, -3),

  collect: (ctx, s, c, t, cap, i) => backdrop(ctx, i) + head(ctx, s)
    + e("🐙", -20, 720, 160, -12) + e("🌮", 920, 760, 150, 12)
    + device(ctx, cap, c.capture, 4)
    + e("✨", 820, 1180, 170, 0) + pop(ctx.text(s.sticker), 650, ctx.H - 280, 110, 6),

  closer: (ctx, s, c, t, cap, i) => backdrop(ctx, i, 560)
    + `<div class="abs" style="left:255px;top:260px;width:570px;height:570px;border-radius:50%;box-shadow:0 0 0 14px rgba(255,255,255,.35),0 0 0 40px rgba(255,255,255,.15)"></div>`
    + `<img class="abs" src="${ICON}" style="left:290px;top:295px;width:500px;border-radius:110px;box-shadow:0 30px 70px rgba(0,0,0,.4)">`
    + `<div class="abs title" data-fit="width" style="left:40px;right:40px;top:${Math.min(960, ctx.H - 770)}px;font-size:170px">${ctx.text(s.title)}</div>`
    + `<div class="abs" style="left:40px;right:40px;top:${Math.min(1360, ctx.H - 370)}px;display:flex;flex-direction:column;align-items:center;gap:26px">
        ${s.chips.map(chip => `<div class="chip" data-fit="width" style="max-width:100%">${ctx.text(chip)}</div>`).join("")}</div>`
    + e("🤩", 60, 120, 170, -14) + e("💎", 860, 140, 150, 12) + e("🚀", 850, 720, 160, 20) + e("🎉", 60, 720, 150, -10),
};

function renderSlide(ctx, slide, index, capture) {
  const s = ctx.strings.slides[slide.id];
  const tune = { ...slide.tune?.[ctx.deviceName], ...capture?.tune?.[slide.id] };
  const [from, to] = slide.background;
  return `<div class="slide ${slide.id}" style="height:${ctx.H}px;background:linear-gradient(160deg, ${from}, ${to})">${LAYOUTS[slide.id](ctx, s, slide, tune, capture, index)}</div>`;
}

/* ---------- Feature graphic (1024x500, the same for every device) ---------- */

function featureGraphic(ctx) {
  const s = ctx.strings.featureGraphic;
  // Back layer: small, soft emojis for depth. Front layer: big ones in the corners, clear of the title
  const back = [["🍕",210,40],["🎬",420,10],["🌽",600,30],["🦒",790,60],["🏦",150,250],["🍭",860,240],["🛰️",260,410],["🐙",470,420],["🌮",640,410],["🎢",780,400],["😂",60,120],["🥳",950,120],["🌋",70,330],["🐶",930,330]];
  const front = [["🤩",-15,-30,120,-14],["🚀",880,-10,140,18],["💎",-5,355,140,-8],["🦄",860,330,160,10],["🤑",330,-55,90,10],["🌈",590,-50,90,-8],["💥",250,400,100,-12],["🎉",650,395,105,12]];
  let out = `<div class="abs" style="inset:0;background:repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,.07) 0deg 9deg, transparent 9deg 18deg)"></div>`
          + glow(512, 230, 360, "rgba(255,197,61,.45)");
  back.forEach(([ch, x, y], i) => out += `<span class="deco e" style="left:${x}px;top:${y}px;font-size:60px;transform:rotate(${i % 2 ? 12 : -12}deg);opacity:.45;filter:blur(1.5px)">${ch}</span>`);
  front.forEach(([ch, x, y, z, r]) => out += e(ch, x, y, z, r));
  return `<div class="fg" style="background:radial-gradient(ellipse at 50% 45%, #b04bff 0%, #7b2ff7 45%, #4A1FA8 100%)">${out}
    <div class="abs title" data-fit="width" style="left:100px;right:100px;top:95px;font-size:168px;-webkit-text-stroke:12px #1C1233;text-shadow:0 12px 0 #1C1233">${ctx.text(s.title)}</div>
    <div class="abs" style="left:150px;right:150px;top:318px;text-align:center"><span data-fit="width" style="display:inline-block;max-width:100%;white-space:nowrap;background:#1C1233;color:#fff;font:900 34px var(--body-font), sans-serif;padding:12px 34px;border-radius:999px">${ctx.text(s.tagline)}</span></div></div>`;
}

/* ---------- Fitting translated text ---------- */

/**
 * Shrinks text until it fits, since translations run longer than English:
 *  data-fit="width"  each line fits its box
 *  data-fit="lines"  wraps to at most data-lines lines
 *  data-fit="slide"  stays inside the slide (stickers)
 */
function fitText(root) {
  const frame = root.firstElementChild.getBoundingClientRect();
  const scale = frame.width / root.firstElementChild.offsetWidth;
  root.querySelectorAll("[data-fit]").forEach(el => {
    const mode = el.dataset.fit;
    if (mode === "width") el.style.whiteSpace = "nowrap";
    let size = parseFloat(getComputedStyle(el).fontSize);
    const fits = () => {
      if (mode === "width") return el.scrollWidth <= Math.min(el.clientWidth, el.parentElement.clientWidth) + 1;
      if (mode === "lines") return el.getBoundingClientRect().height / scale <= Number(el.dataset.lines) * size * 1.15 + 40;
      const r = el.getBoundingClientRect();
      return r.left >= frame.left + 10 * scale && r.right <= frame.right - 10 * scale;
    };
    while (!fits() && size > 20) el.style.fontSize = (size -= 2) + "px";
  });
}
