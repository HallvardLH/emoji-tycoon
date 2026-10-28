# Store listing images

Templates for the Google Play screenshots (phone and tablet) and the feature graphic, in every listing language.

```
config.json      numbers in captions, languages, devices, the shot list, per-slide tuning
i18n/<lang>.json caption text per language
slides.js        the layouts (Pop style)
template.html    renders one image; render.mjs screenshots it
capture.mjs      guided screenshots from the emulator
render.mjs       renders everything to out/
captures/<device>/<lang>/<name>.png   your emulator captures (home, shop, upgrades, emojidex)
out/<lang>/      feature-graphic.png, phone/NN_*.png, tablet/NN_*.png, overview.png
```

## 1. Capture

Start the app in an emulator with dev cheats on, then:

```
npm run store:capture -- --device phone --lang en
```

For each shot in `config.json › captures` it prints the moment to stage and how (mostly with the Cheats drawer), waits for Enter and saves the screenshot. The Big Emoji shot takes a burst, so you can keep the frame with the most going on. The status bar is set to demo mode (12:00, full battery, no notifications) while capturing. `--only home,shop` retakes a few; `--serial emulator-5556` picks a device when several are connected.

Hide the Cheats button and dev warnings before capturing.

Tablets: run it again on the Tablet_7in and Tablet_10in emulators with `--device tablet7` and `--device tablet10`. All outputs are 9:16, as Play requires.

Languages: the app itself is English only for now, so English captures stand in for every language. Once the app is translated, capture each language with `--lang nb` etc. A language's own capture always wins.

## 2. Tune to the captures

Each capture folder has a `tune.json` describing its captures, by slide id (see `captures/phone/en/tune.json`):

- `tap.focus`: where the Big Emoji is, as `[x, y]` fractions of the capture. The pulse rings and the finger go there.
- `upgrades.callout`: the bit of the capture blown up as a speech bubble (the employee quote), as `{x, y, w, h}` fractions.
- `tap.pops`, `shop.pops`: the numbers that pop out of the screen, matching the capture. A number is shortened for the locale (3.1B); text is used as written (36.2 Qi).

A language without its own captures uses the English ones and their `tune.json`. `config.json › slides` holds fallback `pops`.

## 3. Render

```
npm run store:render
npm run store:render -- --lang nb --device tablet --slides 1,4
```

Check `out/<lang>/overview.png`, then upload. A missing capture renders as a striped placeholder that names the file it needs, and the script lists them at the end.

## Adding a language

Copy `i18n/en.json` to `i18n/<code>.json`, translate it and add the code to `config.json › languages`.

- `[word]` is highlighted yellow, `\n` breaks a line.
- `{emojis}`, `{upgrades}`, `{trophies}` and `{buildings}` come from `config.json › numbers` and are formatted for `locale` (1,600 / 1 600 / 1.600). The popping numbers use the locale's short form (3.1B / 3,1 mrd.).
- Text that runs long shrinks to fit, but short captions read best.
- For a script Lilita One and Nunito don't cover (Cyrillic, Greek, CJK...), add `"fonts": { "title": "...", "body": "..." }` with Google Fonts names (see `ko.json`). They come after Lilita One and Nunito, so Latin letters and numbers keep the game look. For a script the game fonts cover only partly (Turkish, Polish...), add `"replace": true` so the named fonts are used alone (see `tr.json`).

## Adding a device

Add an entry under `config.json › devices` with its output `size` and a `frame` (laid out on a 1080-wide canvas), plus `tune` entries for it on the capture slides. `trimTop` (a fraction of the capture's height) cuts off a status bar the app doesn't draw behind.
