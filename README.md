# Emoji Tycoon

An incremental clicker in the vein of Cookie Clicker where the only art is emojis. Tap the Big Emoji, buy buildings that draw emojis for you, stack upgrades, chase combos, catch shiny emojis and fill the Emojidex.

Built with Expo (SDK 53) and React Native, running on iOS, Android and the web. State lives in Redux and is persisted to AsyncStorage.

---

## Running it

```bash
npm install
npx expo start --web   # or: npm run android / npm run ios
```

The web build serves on http://localhost:8081.

---

## The game

### Core loop
1. **Tap the Big Emoji** to earn emojis, the currency.
2. **Buy buildings** that produce emojis per second (EPS).
3. **Buy upgrades** that multiply buildings, tapping and your max combo.
4. **Tap effect emojis** that pop up for temporary boosts or gifts.
5. **Collect** every emoji you tap away, including rare shinies.

The game loop (`scripts/game/gameLoop.ts`) runs every 100 ms:
- **Every tick:** add EPS × delta and drain the combo.
- **Every 1 s:** count effects down, maybe spawn an effect emoji, update prestige progress and check bank milestones.
- **Every 2.5 s:** check which buildings and upgrades are affordable or unlocked.

There are no offline earnings; time away produces nothing.

### Screens
| Tab | Contents |
|---|---|
| **🛒 Shop** | **Buildings** and **Upgrades** sub-tabs. The bulk-buy control offers 1 / 10 / 100 / Max. A badge shows when something new unlocks. |
| **😀 Emoji** (home) | The Big Emoji, the combo meter, chips for active effects (top-left), and floating effect emojis. |
| **📖 Emojidex** | **Upgrades** (catalogue of every upgrade), **Stats** and **Collection**. |

The header shows your bank, with the per-second rate at a fixed position under it. The menu button opens a drawer with the **Cheats** panel.

### The Big Emoji
- **Tapping:** every tap swaps it for a new random emoji, and the tapped one is added to your Collection.
- **Weighted picks:** categories are weighted (faces 30, animals/food 20, objects 15, … symbols 3), about 1,600 emojis in total.
- **Reserved emojis:** effect emojis (🚀💎🍀😈💣🎁) are never picked, so they stay special.
- **Tap feel:**
  - The emoji squishes while pressed and springs back with a wobble.
  - The next emoji pops in with a slight tilt.
  - The tapped one hops off to one side and falls with a gentle lean.
  - A shockwave ring goes out from the disc.
  - A combo-coloured "+N" punches in and floats up.
  - From ×2 combo, ✦ sparks burst out (more at higher combos).

**Emojis per tap (EPT):**
```
EPT = (baseEPT × Π tap multipliers (upgrades, effects)  +  EPS × Σ tap-% of EPS)
      × Π (1 + tap % increases)
      × combo multiplier × fun value multiplier
```
Tap multipliers boost only the base tap, not the share of production the "hands" add.

### Combo
- **Hidden tap boost:** each tap adds 1 to it, and every 10 boost is one combo level (×1, ×2, ×3…). The multiplier applies to EPT.
- **Drain:** the boost drains at `2.5 + (level − 1)` per second, so each level needs faster tapping to hold. At ~5 taps/s you top out around ×4, and at 9+ taps/s you can reach ×8.
- **Max combo:** starts at **×3**. Five combo upgrades raise it to **×8**.
- **Combo taps:** these unlock the combo upgrades. Each tap counts as taps × the combo it was made at.

| Upgrade | Max | Unlocks at (combo taps) | Price |
|---|---|---|---|
| Warm-up 🔥 | ×4 | 1,000 | 25 K |
| Hot streak ⚡ | ×5 | 6,000 | 5 M |
| On fire 💥 | ×6 | 25,000 | 1 B |
| Inferno 🌋 | ×7 | 80,000 | 1 T |
| Supernova 🌟 | ×8 | 250,000 | 1 Qa |

- **Combo meter:** one segment per level, ×1 up to your max. It starts empty, and the segment filling is the level you're on. The top segment (pink) is the stretch you can hold at max. "COMBO ×N" / "MAX COMBO ×N" sits under the bar.
- **Combo rain:** reaching max combo (when max is ×4 or more) sets off an emoji shower behind the stage, at most once every 15 s.

### Shiny emojis
- **Chance:** 1 in 200 Big Emojis is shiny, with a gold glow, twinkles and a "✨ SHINY ✨" tag.
- **Reward:** tapping one gives a bonus of max(EPT × 50, EPS × 60) with a celebration burst.
- **Collection:** shinies are tracked per emoji and marked in the Collection.

### Buildings
- **Unlock:** 17 buildings, each appearing in the shop once you have ¼ of its price.
- **Price and output:** the price is `basePrice × 1.175^owned`, and EPS is `baseEps × owned × Π upgrade multipliers`.

| # | Building | Icon | Base price | Base EPS |
|---|---|---|---|---|
| 0 | Drawing hand | ✍️ | 10 | 0.1 |
| 1 | Graphic design studio | 🎨 | 100 | 1 |
| 2 | Farm | 🌽 | 1,000 | 8 |
| 3 | Restaurant | 🍽️ | 10 K | 42 |
| 4 | Petting zoo | 🦒 | 100 K | 220 |
| 5 | Factory | 🏭 | 1 M | 1,200 |
| 6 | Sports center | 🏈 | 10 M | 6,500 |
| 7 | Bank | 🏦 | 100 M | 33 K |
| 8 | Emoji theme park | 🎢 | 1 B | 190 K |
| 9 | Emoji assembly | 🏛️ | 10 B | 1 M |
| 10 | Space station | 🛰️ | 100 B | 6.3 M |
| 11 | Candy kingdom | 🍭 | 1 T | 40 M |
| 12 | Emoji volcano | 🌋 | 10 T | 260 M |
| 13 | Temple of the Big Emoji in the sky | 🏯 | 100 T | 1.8 B |
| 14 | Emoji supercomputer | 🖥️ | 1 Qa | 12 B |
| 15 | Emoji black hole | 🕳️ | 10 Qa | 87 B |
| 16 | Emoji singularity | ⚛️ | 100 Qa | 630 B |

### Upgrades
| Kind | Effect | Unlock | Price |
|---|---|---|---|
| **Standard building** | ×2 that building's EPS (some also ×2 tapping) | Own 1 / 5 / 10 / 20 / 30 / 40 / 50 / 60 / 75 / 90 / 100 / 125 / 150, then +25 per tier | 4 × the building's price at the unlock amount |
| **Helper** | +X% total EPS or +X% tapping | Every 10 of a building | The building's price at 10t + 5 owned |
| **Big Emoji ("hands")** | Tapping gains +1% of EPS | Emojis earned from tapping ≥ 10^(tier+2) | `10^(tier+4) + taps × 10^tier` |
| **Combo level** | +1 max combo | Combo taps (see Combo) | Fixed, see table above |

Each building has its own themed set:
- **Farm:** veggie helpers.
- **Petting zoo:** animal helpers, +10% tapping each.
- **Big Emoji:** 25 "hands" that turn demonic late on.

The tone leans on puns, pop-culture jokes and upgrades that get darker the further you go. The upgrade data lives in `scripts/game/upgrades/upgradeData/`.

### Effect emojis
Effect emojis spawn at random on-screen positions and grow in with a pulse. Tap one to activate it. Active boosts show as chips with a smoothly draining bar. Several effects of the same kind **stack** into one chip, with a count and their multipliers combined.

| Emoji | Effect | Duration | On screen for |
|---|---|---|---|
| 🚀 | ×2 tapping | 20 s | 25 s |
| 💎 | ×3 tapping | 15 s | 25 s |
| 🍀 | ×2 production | 30 s | 25 s |
| 😈 | ×77 production (fun value 17 only, 5%) | 4 s | 10 s |
| 💣 | ×0.5 production (bad, only after 1 M EPS) | 15 s | 15 s |
| 🎁 | Gift: min(15 min of EPS, 10% of bank) + 0–999 | instant | 25 s |

- **Spawning:** the chance rises with time since the last spawn. The first is possible at 100 s, the typical wait is about two minutes, and a spawn is guaranteed by 300 s. There's a 1% chance of a double.
- **Type weights:** tap 40 / production 40 / gift 20.
- **Celebrations:** tapping an effect plays a burst naming what you got (e.g. "GIFT! +12.3K").
- **Exits:** tapped effects burst away, and effects that time out (or chips that run out) fade.

### Milestones
- **Bank milestones:** a toast celebrates each power of 1,000 emojis drawn all-time (1 K, 1 M, 1 B…).
- **First building:** buying your first building also gets one.

### Collection and Stats
- **Collection:** a grid of every emoji by category, with filter chips (wrapping), found / total and %, a shiny count, and per-emoji tap counts.
- **Stats:**
  - total emojis drawn
  - taps
  - emojis from tapping
  - combo taps
  - magical (effect) emojis tapped
  - shiny emojis tapped
  - a cryptic 🔮 "???" row that shows the fun value

### Fun value
A secret number from 1–100, rolled on a new game and on reset, like Cookie Clicker's seed. Most values do nothing. These give the game a quirk (source of truth: `scripts/game/funValues.ts`, kept in sync with the `howFun()` checks):

| Value | Name | Effect |
|---|---|---|
| 1–2 | Cookie clicker | Effect emojis are 🍪, bad ones 👵 |
| 17 | Devilish | 😈 ×77 production effect can appear |
| 31–40 | Low gravity | Tapped emojis float up and away |
| 42 | The answer | +4.2% production |
| 50 | Perfectly balanced | Tapping ×0.5, production ×1.5 |
| 64 | Overclocked | Combo can go one level higher |
| 70–75 | Impatient | Effect emojis spawn sooner |
| 76 | Lucky spawns | 10% chance of a bonus effect emoji |
| 77 | Flying money | 💸 on prices |
| 88–90 | Marathon | Combo drains 25% slower |
| 91–98 | Collector | Shiny emojis 1.25× as likely |
| 99 | 99 red balloons | Effect emojis are 🎈, bad ones 📌 |
| 100 | Sad hundred | Stats shows 😭 by the fun value |

### Prestige (not live yet)
- **Emoji essence:** `floor(√(total drawn / 10^10))`, so the first point comes at 10 B.
- **Status:** progress is tracked, but `PrestigeMeter` renders nothing, and there's no ascend action or anything to spend essence on.

### Cheats (drawer)
The drawer has these sections:
- **Emojis:** +1 M / +1 Qa / +1 Oc.
- **Stats:** +10k combo taps, ×1000 tap earnings, +25 collection, +5 shiny, +10 magical.
- **Effect emojis:** spawn one, or spawn ten.
- **Shiny:** an "only shiny emojis" toggle.
- **Fun value:** a stepper, plus an expandable lookup table.
- **Danger zone:** reset, which needs a two-tap confirm.

---

## Design

The "Candy Arcade" look: a deep grape night background, white "paper" cards, chunky buttons with a ledge, and pill chips. Design tokens are in `components/misc/theme.ts`:

| Token | Value |
|---|---|
| grape | #22154A |
| night | #170E36 |
| spotlight | #4A33A6 |
| paper | #FBF8FF |
| ink | #1C1233 |
| violet | #6A4BE0 |
| sun | #FFC53D |
| pop | #FF5C7A |
| lilac | #B7A9EE |

- **Fonts:** Lilita One for display, Nunito for body.
- **Radii:** 10 / 14 / 20 / 24 / pill.
- **Emoji art:** all game art is native emoji, so it looks different on iOS, Android and Windows.

---

## Code map

```
app/                      expo-router screens: _layout (game loop, fonts, toasts), (tabs)/index, shop, emojidex
screens/                  tab contents (Shop, Emojidex sub-screens)
components/
  gameUI/BigEmoji/        BigEmoji (tap handling, combo meter), FlyingEmoji, FlyingNumber, TapSparks, ComboRain
  gameUI/Meters/          EffectMeters (stacked effect chips)
  gameUI/                 EffectPopup, EffectBurst (celebrations), MilestoneToast, Buildings/, Upgrades/
  collection/             CollectionList, StatsList
  drawer/                 Cheats, FunValueCheat, ResetButton
  generalUI/              ChunkyButton, Badge, SegmentedControl, Text
  animations/             PulseAnimation, usePresence (animate items out after they leave a list)
  misc/theme.ts           design tokens
scripts/
  game/                   gameLoop, bigEmoji (taps, shiny), tapBoost (combo), calculations (EPS/EPT),
                          milestones, cheats, funValues, shorthands (howFun, fun multipliers)
  game/buildings/         building data, buying, unlock checks
  game/upgrades/          upgrade data, prices, unlock checks, bonuses
  game/effects/           effect data, spawning, timers
  redux/                  slices: values, buildings, upgrades, bigEmoji, effects, collection, stats,
                          prestige, preferences, tabs
```

### Conventions
- **Redux selectors:** select narrow fields, not whole slices. `bigEmoji.tapBoost` changes 10×/s, so subscribing to the whole slice re-renders the stage.
- **Animations:** use the native driver with transforms (e.g. `scaleX` with `transformOrigin: 'left'` rather than width). Build interpolations once in `useMemo`.
- **Upgrade ids:** assigned in blocks per building. Combo upgrades use block 99 (ids 9900+).
- **Save migrations:** new stats fields are migrated in `gameLoop.ts` (e.g. `comboTaps` defaults to `bigEmojiTaps`).

---

## Known gaps
- **Prestige:** the UI is disabled, and essence has no use.
- **Offline earnings:** none, and there's no settings screen yet.
- **Background rain:** the `EmojiRain` background is commented out on the home screen (`ComboRain` is separate and active).
- **Web reloads:** deep links like `/shop/Buildings` show "Unmatched Route" on a hard reload.
- **Type-check:** `tsc` has 13 errors in `screens/AppNavigationStack.tsx` and `scripts/game/upgrades/upgradeBonus.tsx`.
