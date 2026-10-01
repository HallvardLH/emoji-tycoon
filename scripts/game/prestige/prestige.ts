import store from "../../redux/reduxStore";
import { completePrestige, setRunPeakEps, buyPerk, migratePrestige, setLastSeen, updateRemainingEmojisPrestigePerc, PRESTIGE_STATE_VERSION } from "../../redux/prestigeSlice";
import { resetBuildings } from "../../redux/buildingsSlice";
import { resetUpgrades, addUpgrade } from "../../redux/upgradesSlice";
import { resetBigEmoji, addEmojisPerTapPercentageOfEps } from "../../redux/bigEmojiSlice";
import { resetEffects } from "../../redux/effectsSlice";
import { resetValues, setFunValue, updateEmojis } from "../../redux/valuesSlice";
import { addEmojisGained } from "../../redux/statsSlice";
import { isComboUpgradeId } from "../upgrades/upgradeData/nonBuilding/combo";
import { getUpgradeDataById } from "../upgrades/shorthands";
import { calculateBuildingsEps, syncBuildingPrices } from "../buildings/buildings";
import { calculateEpt } from "../calculations";
import { pickNextEmoji } from "../bigEmoji";
import { unlockUpgrades } from "../upgrades/checks";
import { celebrateMilestone } from "../milestones";
import { formatNumber } from "../../misc";
import { startingEmojis, hasPerk, offlineEarnings, perks, canBuyPerk } from "./perks";

/**
 * Emoji essence
 *
 * Essence comes from all the emojis you've ever drawn, on a fourth root curve:
 * the total essence N emojis are worth is (N / ESSENCE_UNIT)^(1/4). Prestiging
 * pays out whatever the all-time total is worth beyond the essence already earned,
 * so each run has to go further than the last to earn as much again.
 *
 * Unspent essence boosts production (2% each), and essence buys perks.
 *
 * Tuned with the balance sim: a cube root let essence snowball into prestiging
 * every hour mid-game; with a fourth root runs shrink from ~19 h to ~5 h and then
 * lengthen again. The first prestige pays ~50 essence at ~1 Qa emojis drawn.
 */
export const ESSENCE_UNIT = 2e8;
const ESSENCE_ROOT = 4;

/** Total essence that a number of emojis drawn is worth */
export function essenceForEmojis(emojis: number) {
    return Math.floor(Math.pow(Math.max(0, emojis) / ESSENCE_UNIT, 1 / ESSENCE_ROOT));
}

/** All-time emojis needed for a total amount of essence */
export function emojisForEssence(essence: number) {
    return Math.pow(essence, ESSENCE_ROOT) * ESSENCE_UNIT;
}

/** Essence a prestige right now would give */
export function getPendingEssence() {
    const { stats, prestige } = store.getState();
    return Math.max(0, essenceForEmojis(stats.emojisGained) - prestige.totalEssenceEarned);
}

/** All-time emojis drawn needed for the next pending essence */
export function emojisForNextEssence() {
    const { stats } = store.getState();
    return emojisForEssence(essenceForEmojis(stats.emojisGained) + 1);
}

/** Updates the progress towards the next essence (0 - 100), for the home screen meter */
export function calculateRemainingEmojisForNextPrestige() {
    const emojisGained = store.getState().stats.emojisGained;
    const current = emojisForEssence(essenceForEmojis(emojisGained));
    const next = emojisForNextEssence();
    const progress = Math.min(100, Math.max(0, (emojisGained - current) / (next - current) * 100));
    store.dispatch(updateRemainingEmojisPrestigePerc(progress));
    return progress;
}

/**
 * Prestige: trade the run for emoji essence
 *
 * Resets the bank, buildings, building and hand upgrades and effects. Keeps the
 * collection, all-time stats, combo level upgrades, the fun value and everything
 * prestige-related (essence, perks). Muscle memory also keeps the hands.
 *
 * @returns the essence gained, or 0 if there was none to gain (nothing happens then)
 */
export function prestige() {
    const essence = getPendingEssence();
    if (essence < 1) return 0;

    const state = store.getState();
    const { funValue } = state.values;
    const keepHands = hasPerk("muscleMemory");
    const keptUpgrades = state.upgrades.owned.filter(id =>
        isComboUpgradeId(id) || (keepHands && getUpgradeDataById(id)?.variant === "Big emoji percentage"));

    store.dispatch(completePrestige({ essence, runStartEmojis: state.stats.emojisGained }));

    store.dispatch(resetValues());
    store.dispatch(setFunValue(funValue));
    store.dispatch(resetBuildings());
    store.dispatch(resetUpgrades());
    store.dispatch(resetBigEmoji());
    store.dispatch(resetEffects());

    keptUpgrades.forEach(id => {
        store.dispatch(addUpgrade(id));
        const upgrade = getUpgradeDataById(id);
        if (upgrade?.emojisPerTapPercentageOfEps) {
            store.dispatch(addEmojisPerTapPercentageOfEps(upgrade.emojisPerTapPercentageOfEps));
        }
    });

    const start = startingEmojis();
    if (start > 0) store.dispatch(updateEmojis(start));

    syncBuildingPrices();
    calculateBuildingsEps();
    calculateEpt();
    pickNextEmoji();
    unlockUpgrades();
    calculateRemainingEmojisForNextPrestige();

    return essence;
}

/**
 * Buys a perk with essence, if it can be bought
 *
 * @returns whether it was bought
 */
export function purchasePerk(id: string) {
    const perk = perks.find(p => p.id === id);
    if (!perk || !canBuyPerk(perk)) return false;
    store.dispatch(buyPerk({ id, cost: perk.cost }));
    // Bought right after prestiging, Head start still applies to this run
    const { buildings, values } = store.getState();
    if (id === "headStart" && buildings.buildings.every(building => building.amount === 0)) {
        store.dispatch(updateEmojis(values.emojis + startingEmojis()));
    }
    // Spent essence no longer boosts production, and some perks change prices
    syncBuildingPrices();
    calculateBuildingsEps();
    calculateEpt();
    return true;
}

/**
 * Runs once at game start: migrates old saves, and pays out offline earnings if a perk allows them
 */
export function startPrestige() {
    const prestigeState = store.getState().prestige;

    if (prestigeState.version !== PRESTIGE_STATE_VERSION) {
        store.dispatch(migratePrestige());
        // Their old, unearned essence was boosting production
        calculateBuildingsEps();
    }

    const offline = offlineEarnings();
    const lastSeen = store.getState().prestige.lastSeen;
    const { emojisPerSecond, emojis } = store.getState().values;
    if (offline && lastSeen) {
        const awaySeconds = Math.min((Date.now() - lastSeen) / 1000, offline.maxSeconds);
        // Ignore quick reloads
        if (awaySeconds > 60) {
            const earned = emojisPerSecond * offline.rate * awaySeconds;
            if (earned > 0) {
                store.dispatch(updateEmojis(emojis + earned));
                store.dispatch(addEmojisGained(earned));
                celebrateMilestone({ icon: "🌙", caption: "WHILE YOU WERE AWAY", title: `+${formatNumber(earned, 1)} emojis` });
            }
        }
    }
    store.dispatch(setLastSeen(Date.now()));
}

/**
 * Keeps track of this run's best production for Head start (perk). Skipped while a
 * production effect is active, so a lucky ×77 doesn't set it.
 */
export function trackRunPeak() {
    const { values, effects, prestige: prestigeState } = store.getState();
    if (effects.effects.some(effect => effect.epsMult)) return;
    if (values.emojisPerSecond > (prestigeState.runPeakEps ?? 0)) {
        store.dispatch(setRunPeakEps(values.emojisPerSecond));
    }
}

/** Called every second, so offline earnings know when the game stopped */
export function updateLastSeen() {
    store.dispatch(setLastSeen(Date.now()));
}
