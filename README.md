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

Time away (closed, in the background or in a hidden tab) produces nothing. Coming back after more than a minute offers the missed production, up to 8 h: 100% for watching an ad, 200% for premium currency (both stubs in `scripts/monetization.ts` for now). Shorter breaks pay full production. See `scripts/game/offline.ts`.

### Screens
| Tab | Contents |
|---|---|
| **🛒 Shop** | **Buildings** and **Upgrades** sub-tabs. The bulk-buy control offers 1 / 10 / 100 / Max. A badge shows when something new unlocks. |
| **😀 Emoji** (home) | The Big Emoji, the combo meter, chips for active effects (top-left), and floating effect emojis. |
| **📖 Emojidex** | **Upgrades** (catalogue of every upgrade), **Stats** and **Collection**. |

The header shows your bank, with the per-second rate at a fixed position under it. The menu button opens a drawer with the **Cheats** panel.

**Desktop:** the web build in a window at least 1000 px wide shows three columns, a third each, with no tab bar or page header (`components/layout/DesktopLayout.tsx`, `desktop.ts`): the Shop's upgrades on the left; the Big Emoji in the middle, with the bank, rate and essence above it and the cheats and menu buttons at its top right; and on the right, the buildings, the Emojidex or the settings, picked in a navbar. The menu button opens the settings there. Phones and tablets (the native app) always get the tabs.

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
EPT = (baseEPT  +  EPS × Σ tap-% of EPS)
      × Π tap multipliers (upgrades, effects)
      × Π (1 + tap % increases)
      × combo multiplier × fun value multiplier
```
Tap multipliers boost the whole tap, including the share of production the "hands" add. (They used to boost only the base tap, which made "Tapping ×2" worth next to nothing once hands carried tapping.)

### Combo
- **Hidden tap boost:** each tap adds 1 to it, and every 10 boost is one combo level (×1, ×2, ×3…). The multiplier applies to EPT.
- **Drain:** the boost drains at `2.5 + (level − 1)` per second, so each level needs faster tapping to hold. At ~5 taps/s you top out around ×4, and at 9+ taps/s you can reach ×8.
- **An unlock:** there's no combo at the start, as one from the first tap made tapping too strong early on. The **Combo!** upgrade turns it on up to **×3**, and five more raise it to **×8**. Each needs the one before it. Until then there's no meter, and tapping fast does nothing extra.
- **Combo taps:** these unlock the combo upgrades. Each tap counts as taps × the combo it was made at (1 before the combo is on).

| Upgrade | Max | Unlocks at (combo taps) | Price |
|---|---|---|---|
| Combo! 🥁 | ×3 | 200 | 10,000 |
| Warm-up 🔥 | ×4 | 1,000 | 25 K |
| Hot streak ⚡ | ×5 | 6,000 | 5 M |
| On fire 💥 | ×6 | 25,000 | 1 B |
| Inferno 🌋 | ×7 | 80,000 | 1 T |
| Supernova 🌟 | ×8 | 250,000 | 1 Qa |

- **Combo meter:** one segment per level, ×1 up to your max. It starts empty, and the segment filling is the level you're on. The top segment (pink) is the stretch you can hold at max. "COMBO ×N" / "MAX COMBO ×N" sits under the bar.
- **Combo rain:** reaching max combo (when max is ×4 or more) sets off an emoji shower behind the stage, at most once every 15 s.

### Sound effects
- **Taps:** a quiet, short "plop", like the clicks in Cookie Clicker: one of six slightly different ones, never the same twice in a row, at most ~18 a second.
- **Shiny emojis:** a sparkling chime instead.
- **Buying:** a light two-note "bling" for buildings (one per purchase, however many), and a short three-note sparkle for upgrades.
- **Files:** generated by `node scripts/tools/generateSounds.js` into `assets/sounds/` (edit and rerun to change them), played with `expo-audio` from `scripts/game/sounds.ts`. They mix with other audio on iOS, briefly duck it on Android, and stay quiet when the phone is on silent. Settings has an on/off switch.

### Shiny emojis
- **Chance:** 1 in 200 Big Emojis is shiny, with a gold glow, twinkles and a "✨ SHINY ✨" tag.
- **Unlock:** none appear until 10,000 emojis have been produced all-time (`SHINY_FROM_EMOJIS_PRODUCED` in `bigEmoji.ts`). The "Only shiny" cheat ignores this.
- **Reward:** tapping one gives a bonus of max(EPT × 50, EPS × 60) with a celebration burst.
- **Collection:** shinies are tracked per emoji and marked in the Collection.

### Buildings
- **Unlock:** 23 buildings, each appearing in the shop once you have ¼ of its price. Saves made before a building existed get it added as they load (`buildingsSlice`).
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
| 7 | Emoji cinema | 🎬 | 100 M | 33 K |
| 8 | Bank | 🏦 | 1 B | 190 K |
| 9 | Emoji theme park | 🎢 | 10 B | 1 M |
| 10 | Emoji assembly | 🏛️ | 100 B | 6.3 M |
| 11 | Emoji airline | ✈️ | 1 T | 40 M |
| 12 | Space station | 🛰️ | 10 T | 260 M |
| 13 | Candy kingdom | 🍭 | 100 T | 1.8 B |
| 14 | Emoji volcano | 🌋 | 1 Qa | 12 B |
| 15 | Temple of the Big Emoji in the sky | 🏯 | 10 Qa | 87 B |
| 16 | Emoji supercomputer | 🖥️ | 100 Qa | 630 B |
| 17 | Emoji black hole | 🕳️ | 1 Qi | 4.7 T |
| 18 | Emoji singularity | ⚛️ | 10 Qi | 36 T |
| 19 | Emoji time machine | 🕰️ | 100 Qi | 280 T |
| 20 | Big bang | 💥 | 1 Sx | 2.2 Qa |
| 21 | Emoji multiverse | 🌀 | 10 Sx | 18 Qa |
| 22 | The first emoji | 🙂 | 100 Sx | 150 Qa |

### Upgrades
| Kind | Effect | Unlock | Price |
|---|---|---|---|
| **Standard building** | ×2 that building's EPS (some Drawing hand ones also multiply tapping: ×2, then ×1.25 from tier 12) | Own 5 / 10 / 15 / 20 / 30 / 40 / 50 / 60 / 75 / 90 / 100 / 125 / 150, then +25 per tier | 4 × the building's price at the unlock amount |
| **Helper** | +X% total EPS or +X% tapping | Every 10 of a building | The building's price at 10t + 5 owned |
| **Big Emoji ("hands")** | Tapping gains +1% of EPS (the first five), +0.1% (the rest) | Emojis earned from tapping ≥ 10^(tier+2) | `10^(tier+4) + taps × 10^tier` |
| **Combo level** | Turns the combo on, then +1 max combo | Combo taps (see Combo) | Fixed, see table above |
| **Effect emojis** | Turns effect emojis on, then more often / longer | Emojis earned (see Effect emojis) | Fixed, see Effect emojis |

**Round prices:** every upgrade price is rounded to the nearest of 10, 15, 20, 25, 30, 40, 50, 75 or 100 at its scale (47 → 50, 90 → 100, 4,700 → 5,000). This is `roundToPriceStep` in `scripts/utils.ts`, applied in `getUpgradePrice`, so a step can move a price up to about 20% either way.

Each building has its own themed set:
- **Farm:** veggie helpers.
- **Petting zoo:** animal helpers, +10% tapping each.
- **Restaurant:** dish helpers, +1% total EPS each.
- **Sports center:** athlete helpers, +10% tapping each.
- **Space station:** crew and sights helpers, +1% total EPS each.
- **Candy kingdom:** sweet helpers, +1% total EPS each.
- **Big Emoji:** 25 "hands" that turn demonic late on.
- **Every building** has 20 standard upgrades (tiers 0 - 19, the last at 325 owned), each ×2 that building's production. The Farm, Restaurant, Petting zoo, Sports center, Emoji assembly, Space station and Candy kingdom also have helpers.
- **Tap values in saves:** buying an upgrade stores its tap values, so `syncTapModifiers` rebuilds them from the owned upgrades at start, picking up changes to the data.

The tone leans on puns, pop-culture jokes and upgrades that get darker the further you go. The upgrade data lives in `scripts/game/upgrades/upgradeData/`.

### Effect emojis
Effect emojis spawn at random on-screen positions and grow in with a pulse. Tap one to activate it. Active boosts show as chips with a smoothly draining bar. Several effects of the same kind **stack** into one chip, with a count and their multipliers combined.

None appear until **Good vibes** is bought. Like Cookie Clicker's golden cookie upgrades, its siblings then make them appear more often and the good ones last longer. Each needs the one before it, and all are kept through prestige (`scripts/game/upgrades/upgradeData/nonBuilding/effectEmojis.ts`, read by `scripts/game/effects/effectUpgrades.ts`).

| Upgrade | Effect | Unlocks at (emojis earned) | Price |
|---|---|---|---|
| Good vibes ✨ | Effect emojis start appearing | 2,000 | 5,000 |
| Lucky stars 💫 | Appear ×2 as often | 1 M | 5 M |
| Slow motion ⏱️ | Good effects last ×2 as long | 1 B | 5 B |
| Shooting stars 🌠 | Appear ×2 as often again | 1 T | 5 T |

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
  - **Made by each building:** what each building has made in total, biggest first, with every buff counted (upgrades, percentages, essence and perks, active effects, claimed offline earnings). Each tick's production is split by each building's share of base output (`scripts/game/buildings/buildingTotals.ts`). It's all-time, so prestige keeps it; saves start counting from when it was added.

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

### Prestige (emoji essence ✨)
- **Earning essence:** the essence all-time emojis drawn are worth is `floor((total drawn / 2×10^8)^(1/4))`. Prestiging pays out what that's worth beyond the essence already earned, so each run has to go further to earn as much again. About 50 essence for the first prestige, at ~1 Qa drawn.
- **What it does:** each *unspent* essence gives +2% production (2.5% with Resonance). Essence also buys perks, which gives up that bonus (Overflow gives half of it back).
- **Resets:** bank, buildings, building upgrades, hands, effects. **Keeps:** collection, all-time stats, combo and effect emoji upgrades, fun value, essence, perks and trial rewards.
- **Perks:** each prestige unlocks the next tier (tier 1 after the first prestige, and so on):

| Tier | Perk | Cost | Effect |
|---|---|---|---|
| 1 | Overtime ⏳ | 5 | Good effects last 50% longer |
| 1 | Gift wrap 🎀 | 15 | Gifts give twice as much |
| 1 | Head start 🎒 | 10 | Start every run with 5 minutes of your last run's best production |
| 2 | Lucky streak 🍀 | 40 | Effect emojis appear 50% more often |
| 2 | Shiny sense 🌟 | 30 | Shiny emojis twice as likely |
| 2 | Resonance 🔮 | 60 | Unspent essence gives +2.5% each |
| 3 | Collector's pride 📖 | 150 | +0.03% production per different emoji collected |
| 3 | Bulk discount 🏷️ | 200 | Buildings 10% cheaper |
| 3 | Magnet 🧲 | 120 | Effect emojis stay on screen twice as long |
| 4 | Neighbourhood 🏘️ | 500 | +3% production per kind of building owned |
| 4 | Muscle memory ✋ | 400 | Keep Big Emoji hands when prestiging |
| 4 | Steady hands 🔥 | 300 | Combo drains 20% slower |
| 5 | Momentum 🌊 | 800 | +1% production per 10 minutes played this run, up to +50% |
| 5 | Second wind 💨 | 1,000 | +1 max combo |
| 5 | Golden touch 👑 | 600 | Shiny emojis worth 5× as much |
| 6 | Overflow 🫗 | 2,500 | Spent essence keeps half its production bonus |
| 6 | Hall of fame 🏆 | 2,000 | +10% production per trial completed |
| 6 | Flying start 🚀 | 1,500 | Head start gives 30 minutes instead of 5 (needs Head start) |

Saves that bought the old offline perks (Night shift, Graveyard shift) get their essence back on load.

- **Trials** (`scripts/game/prestige/trials.ts`), from the 3rd prestige on: prestige into a run with a rule that makes it harder. Drawing the goal that run completes it: the reward is kept forever and the rule lifts for the rest of the run. Each trial pays once, and can be given up (rule lifts, no reward). The goal is a share of the emojis drawn in the run before, so it scales with progress.

| Trial | Rule | Goal | Reward |
|---|---|---|---|
| Hands off 🙅 | Taps draw nothing (starts with 1,000 emojis) | 25% of last run | +15% production |
| Bare bones 🦴 | Upgrades can't be bought | 1% of last run | +50% emojis per tap |
| Dark sky 🌑 | No effect emojis | 50% of last run | Effect emojis appear 25% more often |

- **Run tracking:** play time this run (`prestige.runSeconds`, not counting time away), emojis drawn this run, and essence per hour played. Once the rate drops below 80% of the run's best, the screen suggests prestiging. The last 10 runs are kept in `prestige.history`.
- **UI:** a ✨ chip on the home screen fills toward the next essence and shows what a prestige would pay. It opens `app/prestige.tsx`: the active trial, the reset (two-tap confirm) with run stats, trials, perk tiers and past runs.
- **Pacing (balance sim, player tapping a quarter of the time, prestiging when it would double the essence bonus):**
  - The first prestige comes at about 19 h, with runs shrinking to about 5 h by the 6th.
  - Runs lengthened again after about 100 h, once the first 12 perks were owned. Tiers 5 and 6 and the trials were added for that stretch but haven't been through the sim yet.

### Cheats (drawer)
The drawer has these sections:
- **Emojis:** +1 M / +1 Qa / +1 Oc.
- **Stats:** +10k combo taps, ×1000 tap earnings, +25 collection, +5 shiny, +10 magical.
- **Prestige:** +100 essence, +1 perk tier, +1 h run time, reach the active trial's goal.
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
  game/prestige/          prestige.ts (essence, the reset, run tracking), perks.ts (perk data and effects),
                          trials.ts (trial data, rules and rewards)
  game/offline.ts         time away and the offline earnings offer
  redux/                  slices: values, buildings, upgrades, bigEmoji, effects, collection, stats,
                          prestige, preferences, tabs
```

### Conventions
- **Redux selectors:** select narrow fields, not whole slices. `bigEmoji.tapBoost` changes 10×/s, so subscribing to the whole slice re-renders the stage.
- **Re-renders:** the bank and stats change every tick (10×/s) and the collection on every tap. Displays of them read through `useBank` / `useSampledSelector` (`components/gameUI/useBank.ts`), which sample the store a few times a second. Hidden tab screens stay mounted, so both navigators wrap their screens in `FreezeWhenBlurred`, which suspends them until they're shown again. Without it, a visited Emojidex re-rendered its ~1,600-cell collection on every tap, and tapping lagged until a refresh. Selectors that run on every store update should be cheap or cached (see `ownedComboLevel` in `tapBoost.ts`).
- **Upgrade ids (effect emojis):** effect emoji upgrades use block 98 (ids 9800+).
- **Animations:** use the native driver with transforms (e.g. `scaleX` with `transformOrigin: 'left'` rather than width). Build interpolations once in `useMemo`.
- **Building ids:** the order in `buildingData.ts`, and price and output follow from it, so a building can be inserted anywhere. Upgrade files look their building up by name (`buildingIdOf`), and saves match buildings by name as they load.
- **Upgrade ids:** assigned in blocks per building (block = building id + 1, in list order), so they move when buildings are inserted. Ids a save has that no longer exist are dropped at start (`pruneUnknownUpgrades`). Combo upgrades use block 99 (ids 9900+).
- **Save migrations:** new stats fields are migrated in `gameLoop.ts` (e.g. `comboTaps` defaults to `bigEmojiTaps`).

---

## Known gaps
- **Late prestige:** tiers 5 and 6 and the trials extend it, but once everything is owned there's still no repeatable essence sink. None of it has been through the balance sim yet.
- **Ads and premium currency:** `scripts/monetization.ts` stubs both; they always succeed.
- **Background rain:** the `EmojiRain` background is commented out on the home screen (`ComboRain` is separate and active).
- **Web reloads:** deep links like `/shop/Buildings` show "Unmatched Route" on a hard reload.
- **Type-check:** `tsc` has errors only in `screens/AppNavigationStack.tsx`, an old file nothing uses.
