# Emoji Tycoon — Feature Overview

An incremental clicker in the vein of Cookie Clicker. The only art is emojis (plus a purple gradient UI and the Digitalt display font). Built with Expo / React Native, with Redux for state, persisted to AsyncStorage.

This document was written by playing the game in the browser (Expo web) and reading the source. "Status" notes flag what is implemented, half-implemented, or not reachable in the current build.

---

## 1. Core loop

1. **Tap the Big Emoji** to earn emojis (the currency).
2. **Buy buildings** that produce emojis per second (EPS).
3. **Buy upgrades** that multiply buildings and tapping.
4. **Tap magical effect emojis** that randomly appear for temporary boosts.
5. Keep going to exponentially larger numbers (the number formatting goes past octillions).

The game loop runs every 100 ms (`scripts/game/gameLoop.ts`):
- Every tick: add `EPS × delta` emojis and decay the tap boost.
- Every 1 s: tick effect timers, try to spawn an effect emoji, update prestige progress.
- Every 2.5 s: check which buildings and upgrades are affordable or unlocked, and update emoji essence.

---

## 2. Screens & navigation

Bottom tab bar with three tabs, plus a header and a side drawer.

| Tab | Contents |
|---|---|
| **🛒 Shop** | Two sub-tabs: **Buildings** and **Upgrades**. Bulk-buy toggle (1 / 10 / 100). |
| **😀 Emoji** (home) | The Big Emoji, effect meters (top-left) and floating effect emojis. |
| **📖 Emojidex** | Three sub-tabs: **Upgrades** (catalog of every upgrade), **Stats** and **Collection**. |

- **Header**: current emoji count (animated number) and "per second" rate. Hamburger button (top-right) opens the drawer.
- **Drawer**: currently contains only the **Cheats** panel (see §10).
- **Notification badge** on the Shop tab when new buildings or upgrades unlock while you're on another tab.

---

## 3. The Big Emoji (tapping)

- A large emoji (150–200 px) in the centre of the screen with a slow pulse animation.
- **Every tap swaps it for a new random emoji.** The old one flies off in a random direction, and a "+N" number floats up. Up to 25 of each are animated at once.
- A haptic "rigid" impact fires on each tap (mobile).
- The emoji you tapped away is **added to your Collection** (§7).
- Random emoji selection is weighted by category:

| Category | Weight | # emojis |
|---|---|---|
| faces | 30 | 126 |
| animals | 20 | 124 |
| food | 20 | 126 |
| objects | 15 | 393 |
| bodyParts | 10 | 65 |
| placesBuildings | 10 | 69 |
| plants | 10 | 28 |
| vehicles | 10 | 58 |
| weather | 10 | 47 |
| people | 8 | 313 |
| symbols | 3 | 251 |

  That's about 1,600 emojis in total. Emojis used by effects (🚀💎🍀😈💣🎁) are excluded so they stay special.

### Emojis per tap (EPT) formula
```
EPT = (baseEPT + EPS × Σ(tap % of EPS))
      × Π(tap multipliers from upgrades & active effects)
      × Π(1 + tap % increases)   (floored to 0.1)
      × (floor(tapBoost / 10) + 1)
```
- **Base EPT** starts at 1.
- **Tap boost (hidden combo meter)**: each tap adds +1, and it decays by 0.7 every 100 ms (7/sec). Every 10 points of boost adds another ×1 to EPT. So tapping faster than ~7 taps/sec builds up a multiplier. *Status: works, but has no UI.*

---

## 4. Buildings

17 buildings. Each unlocks (appears in the shop) once you have **¼ of its price** in the bank.

- **Price** of the next one: `basePrice × 1.175^owned`. Bulk buy (1/10/100) sums the prices, and buys as many as you can afford up to that number.
- **EPS** per building: `baseEps × owned × Π(upgrade multipliers)`.
- The "Details" button shows: how many you have, EPS each, and total EPS.

| # | Building | Icon | Base price | Base EPS | Description |
|---|---|---|---|---|---|
| 0 | Drawing hand | ✍️ | 10 | 0.1 | A hand that draws emojis for you. |
| 1 | Graphic design studio | 🎨 | 100 | 1 | A studio where emojis are created. |
| 2 | Farm | 🌽 | 1,000 | 8 | A farm where emojis sprout from the ground. |
| 3 | Restaurant | 🍽️ | 10 K | 42 | Where emojis go to eat food emojis. |
| 4 | Petting zoo | 🦒 | 100 K | 220 | Meet all your favorite emoji animals. |
| 5 | Factory | 🏭 | 1 M | 1,200 | Creating emojis on an industrial scale. |
| 6 | Sports center | 🏈 | 10 M | 6,500 | Keep your emojis in good shape. |
| 7 | Bank | 🏦 | 100 M | 33 K | "We keep your emojis safe." |
| 8 | Emoji theme park | 🎢 | 1 B | 190 K | "Welcome to EmojiLand…" |
| 9 | Emoji assembly | 🏛️ | 10 B | 1 M | Where emojis get together to decide how to make more emojis. |
| 10 | Space station | 🛰️ | 100 B | 6.3 M | Conquer new worlds and take their emojis. |
| 11 | Candy kingdom | 🍭 | 1 T | 40 M | A sugary paradise ruled by the Candy King… |
| 12 | Emoji volcano | 🌋 | 10 T | 260 M | Every eruption brings a flood of brand-new emojis! |
| 13 | Temple of the Big Emoji in the sky | 🏯 | 100 T | 1.8 B | Legends say the Big Emoji in the sky bestows infinite emojis… |
| 14 | Emoji supercomputer | 🖥️ | 1 Qa | 12 B | The ultimate emoji engine. |
| 15 | Emoji black hole | 🕳️ | 100 Qa | 87 B | The final destination of all emojis… or a new beginning? |
| 16 | Emoji singularity | ⚛️ | 1 Qi | 630 B | That's it. Nothing remains besides emojis. You've done it. |

Prices go up ×10 per tier (×100 for the black hole), and base EPS follows a Cookie Clicker-inspired curve. Payback time (price ÷ EPS) grows from 100 s for the first buildings to about 1.6 M s for the last one.

---

## 5. Upgrades

Upgrades appear in **Shop → Upgrades** once unlocked. They are sorted by price, and each card has a building tag, icon, name, flavour description, optional italic **quote** (joke), and a list of its effects. "Details" shows a live preview: *"Buying this upgrade now will add X emojis per second, increasing production by Y%"*.

### Upgrade types
| Variant | Effect | Unlock | Price |
|---|---|---|---|
| **Standard building** | ×2 that building's EPS (some also ×2 tapping) | Own 1 / 10 / 25 / 50 / 100 / 150 of the building (tiers 0–5), then +50 per tier (200, 250 … 850 for tier 19) | `basePrice × 10^(tier+1) / 2` |
| **Helper** | +X% total EPS, or +X% tapping | Every 10 of the building (tier t → 10(t+1) owned) | Building price at (10t + 5) owned |
| **Big emoji ("hands")** | Tap gains +1% of your EPS | Emojis earned from tapping ≥ 10^(tier+2) | `10^(tier+4) + taps × 10^tier` (gets pricier the more you tap) |

### Upgrade content per building
| Building | Standard | Helpers | Notes |
|---|---|---|---|
| Big emoji | — | — | 25 "hands" upgrades: Another hand 👈 → Million hands 🫵 → … → turns dark: Demon hands 👹, Hands of the damned 👻, The lord of Underworld 💀, Rude tapping 🖕 |
| Drawing hand | 20 | — | Body-part themed (💪🖖👐💅🦶👅👃👂👄🦵🫁🧠…🌀). Every 3rd one also doubles tapping |
| Graphic design studio | 20 | — | Art supplies → gets dark (💉🩸) |
| Farm | 20 | 27 veggie/fruit helpers (+1% / +2% / +3% EPS) | 🥔🥕🥒🫑🍅… Farm upgrades end with "The final harvest" ⚰️ and "Giving up farming" 🏢 |
| Restaurant | 20 | — | |
| Petting zoo | 20 | 10 animal helpers (+10% tapping each) | 🐕🐈🦆🐄🐖🐇🐸🐘🐒🐧 ("Woof! I'll help you get emojis!") |
| Factory | 20 | — | |
| Sports center | 7 | — | |
| Bank | 5 | — | |
| Emoji theme park | 5 | — | |
| Emoji assembly | 5 | 2 (+1% EPS) | Interns 🧑‍🎓, Bureaucrats 📎 ("It looks like you're passing a law. Need help?") |
| Space station | 6 | — | Last two names are in alien glyphs (`⍙⟒ ☊⍜⋔⟒ ⟟⋏ ⌿⟒⏃☊⟒...`) |
| Candy kingdom | 5 | — | Gumdrop guards 🍬 → Sugar rush 🍩 ("Donut stop me now!") |
| Emoji volcano | 5 | — | Heat-resistant gloves 🧤 → Supervolcano 🔥 |
| Temple of the Big Emoji | 5 | — | Prayer candles 🕯️ → Divine revelation 🌟 |
| Emoji supercomputer | 5 | — | Download more RAM 💾 → Emoji AI 👁️ ("I'm afraid I can't let you stop tapping, Dave.") |
| Emoji black hole | 5 | — | Event horizon 🌌 → Wormholes 🌠 |
| Emoji singularity | 5 | — | Infinite density ⚫ → The final emoji 🙂 ("Tap to begin again?") |

Humour is a big part of the tone: puns in quotes ("Don't stop beleafing!", "A-maize-ing!"), pop-culture references (Pickle Rick, Shrek onions, Clippy), and several upgrade lines that turn creepy or dark late in the game.

### Emojidex → Upgrades catalog
A grid of every upgrade, grouped by building, showing icon, price and ID (looks like a dev/reference view).

---

## 6. Effect emojis ("magical emojis")

Temporary boost emojis spawn at random positions and fade in with a pulse. Tap one to activate it. An active effect shows a **progress meter** (icon + timer bar + title) in the top-left of the home screen.

| Emoji | Effect | Duration | On screen for |
|---|---|---|---|
| 🚀 | ×2 tapping power | 20 s | 25 s |
| 💎 | ×3 tapping power | 15 s | 25 s |
| 🍀 | ×2 emoji production | 30 s | 25 s |
| 😈 | ×77 emoji production | 4 s | 10 s |
| 💣 | Half emoji production (bad) | 15 s | 15 s |
| 🎁 | Emoji gift: min(1 hour of EPS, 25% of bank) + 0–999 | instant | 25 s |

- **Spawning**: the chance rises the longer it's been since the last spawn. `timeSince/100 − random ≥ 0.5 / spawnChanceMultiplier`, so the first possible spawn is at 50 s, the typical wait is about a minute, and a spawn is guaranteed by 150 s. There's a 1% chance of a double spawn.
- **Type weights**: tap 40% · production 40% · gift 20%. Within a type, the effect is picked at random.
- Bad effects can't spawn until you have 1 M EPS, so your first effect is never negative.
- 😈 ×77 is rare: it only gets chosen with fun value 17, and then at 5%.
- Collecting an effect gives a haptic "boost" and counts toward stats.

---

## 7. Collection (Emojidex → Collection)

- Every emoji you tap away from the Big Emoji is recorded, with a count per emoji.
- Shown as a 6-column grid of emoji × count, ordered by category.
- Gives a "gotta catch 'em all" goal across about 1,600 emojis. *Status: a `rarity` field exists but isn't used.*

---

## 8. Stats (Emojidex → Stats)

- Total emojis drawn (all-time)
- Emoji taps
- Emojis earned from tapping
- Magical emojis tapped
- Fun value (only shown if it's 100, with 😭)

---

## 9. Prestige — Emoji Essence *(work in progress)*

- **Emoji essence** = `floor(√(total emojis drawn / 10^10))`. The first point comes at 10 billion emojis, and the n-th at n² × 10 B.
- Progress % toward the next level is tracked every second.
- Designed lore: *"After having created 10 billion emojis, the very essence of emojis has started accumulating around you… a magical substance that changes its shape whenever you look at it."* The icon is ✨.
- **Status: the UI (`PrestigeMeter`) is disabled (`return null`). There's no reset/ascend action and nothing to spend essence on.**

---

## 10. Hidden & meta systems

### Fun value (like Cookie Clicker's hidden seed)
A random number from 1–100 rolled on a new game (and re-rolled on reset). It changes small things:
| Fun value | Effect |
|---|---|
| 1–2 | All effect emojis become 🍪 cookies, and bad ones become 👵 grandma (Cookie Clicker homage) |
| 17 | 😈 ×77 production effect can appear |
| 70–75 | Effect emojis spawn a bit sooner |
| 76 | 10% chance of a bonus extra effect spawn |
| 100 | Fun value shown in Stats with 😭 |

### Cheats (drawer)
Reset game · Spawn effect emoji · Give 1 million / 1 quadrillion / 1 octillion emojis · shows the current fun value.

### Persistence
The whole Redux store is persisted (`react-native-redux-persist2`, AsyncStorage). Progress survived a page reload in my web test. **No offline earnings**: time spent away doesn't produce emojis.

### Haptics
Success/error on purchases, a rigid impact on taps, and a boost pattern on effect pickup.

---

## 11. Art & presentation

- **Emoji-only art**: no custom sprites for gameplay. Buildings, upgrades, effects, the Big Emoji and the collection are all native emojis. Everything is rendered with the system emoji font, so it looks different on iOS, Android and Windows.
- **Limited UI palette**: a purple radial gradient background, white rounded cards, a cyan/blue "Buy" button, a yellow/orange "Details" button, green cheat buttons, and purple/orange text accents.
- **Font**: Digitalt (a chunky, all-caps arcade look).
- **Animation**: pulsing Big Emoji and effect emojis, flying emojis and numbers on tap, fading effect pop-ins, animated counters.
- **Emoji rain**: a component that rains emojis in the background (count scales with EPS, capped at 75, and switches to active effect emojis during boosts). *Status: implemented but commented out on the home screen.*

---

## 12. Gaps / bugs noticed

**Fixed:** standard upgrade tiers 6–19 now unlock · all effect types spawn · effects spawn about once a minute · 😈 description · Farm helper tier gap · buildings 11–16 have upgrades (and the "Candy Kingdom" type name typo that would have broken them).

**Still open:**
1. The prestige UI is disabled, and essence has no use yet.
2. The tap boost multiplier has no visual indicator.
3. There are no offline earnings, and there's no settings screen (the drawer only has cheats).
4. The Collection doesn't show progress (e.g. 23 / 1,600) or rarity.
5. The emoji rain is commented out.
6. Once you pass 1 M EPS, 💣 makes up about 20% of spawns. Consider per-effect weights if that feels too punishing.
7. On web, deep links like `/shop/Buildings` show "Unmatched Route" on a hard reload.
