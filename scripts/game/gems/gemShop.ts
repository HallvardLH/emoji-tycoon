import store from "../../redux/reduxStore";
import { spendGems, getGems } from "../../monetization";
import { setBoostUntil, setComboKeeperUntil, addDiscoveries, setEssenceCharm, unlockTheme, setTheme } from "../../redux/gemsSlice";
import { updateEmojis } from "../../redux/valuesSlice";
import { addEffectOnScreen, updateTimeSinceLastEffect } from "../../redux/effectsSlice";
import { refundPerks } from "../../redux/prestigeSlice";
import { calculateBaseEmojisPerSecond, calculateEmojisPerSecond, calculateEpt } from "../calculations";
import { buyBuilding, calculateBuildingPrice, calculateBuildingsEps, syncBuildingPrices } from "../buildings/buildings";
import { buyUpgrade } from "../upgrades/upgrades";
import { getUpgradeDataById } from "../upgrades/shorthands";
import { getUpgradePrice } from "../upgrades/upgradePrice";
import { giveOneOffEmojis } from "../giveEmojis";
import { creditBuildings } from "../buildings/buildingTotals";
import { createEffect } from "../effects/createEffect";
import { hasEffectEmojis } from "../effects/effectUpgrades";
import { canBuyUpgrades, canSpawnEffects } from "../prestige/trials";
import { perks } from "../prestige/perks";
import { hasCombo } from "../tapBoost";
import { hasUndiscoveredEmojis } from "../bigEmoji";
import { boostSecondsLeft, comboKeeperSecondsLeft } from "./boost";
import { themeById } from "./themes";

/**
 * What gems buy
 *
 * Everything is priced against production, so no buy is a trap and none is far
 * better than the rest: one gem is worth about MINUTES_PER_GEM minutes of what the
 * buildings make. (For scale: 80 gems cost $0.99, and claiming double offline
 * earnings, 10 gems for up to 8 hours more, is the most generous buy of all.)
 */
export const MINUTES_PER_GEM = 5;

/** Not enough gems: the UI sends the player to the gem store */
export type GemBuyResult = "bought" | "needGems" | "unavailable";

function pay(cost: number): GemBuyResult {
    if (getGems() < cost) return "needGems";
    return spendGems(cost) ? "bought" : "needGems";
}

/**
 * Gems that make up for a number of emojis: one per MINUTES_PER_GEM minutes of
 * production as it is right now (with effects and the boost), so the price matches
 * the wait the buttons show, at least 1
 *
 * @returns undefined before there's any production to price it against
 */
export function gemsForEmojis(emojis: number) {
    const eps = store.getState().values.emojisPerSecond;
    if (!(eps > 0) || !(emojis > 0)) return undefined;
    return Math.max(1, Math.ceil(emojis / (eps * 60 * MINUTES_PER_GEM)));
}

// ---- Buying what you can't afford yet ----

/** Waits shorter than this aren't worth skipping with gems, so there's no offer */
const MIN_WAIT_SECONDS = 60;

/** Gems to skip waiting for a price, or undefined if there's nothing worth skipping */
function skipPrice(price: number) {
    const emojis = store.getState().values.emojis;
    const missing = price - emojis;
    if (missing <= 0 || missing < store.getState().values.emojisPerSecond * MIN_WAIT_SECONDS) return undefined;
    return gemsForEmojis(missing);
}

/** Gems to buy the next bulk buy of a building now, paying for what the bank is short of */
export function buildingGemPrice(buildingId: number) {
    return skipPrice(calculateBuildingPrice(buildingId, undefined, store.getState().values.emojis));
}

export function buyBuildingWithGems(buildingId: number): GemBuyResult {
    const { emojis } = store.getState().values;
    const price = calculateBuildingPrice(buildingId, undefined, emojis);
    const cost = buildingGemPrice(buildingId);
    if (cost === undefined) return "unavailable";
    const paid = pay(cost);
    if (paid !== "bought") return paid;
    // Tops the bank up to the price (rounded up, so it's never a hair short) and buys.
    // A "max" bulk buy then fits exactly the amount the price was for
    store.dispatch(updateEmojis(emojis + Math.ceil(price - emojis)));
    buyBuilding(buildingId);
    return "bought";
}

const upgradePrice = (upgradeId: number) => {
    const upgrade = getUpgradeDataById(upgradeId);
    return getUpgradePrice(upgrade.tier, upgrade.variant, upgrade.building ? upgrade.buildingId : undefined);
};

export function upgradeGemPrice(upgradeId: number) {
    if (!canBuyUpgrades()) return undefined;
    return skipPrice(upgradePrice(upgradeId));
}

export function buyUpgradeWithGems(upgradeId: number): GemBuyResult {
    const cost = upgradeGemPrice(upgradeId);
    if (cost === undefined) return "unavailable";
    const paid = pay(cost);
    if (paid !== "bought") return paid;
    const { emojis } = store.getState().values;
    store.dispatch(updateEmojis(emojis + Math.ceil(upgradePrice(upgradeId) - emojis)));
    buyUpgrade(upgradeId);
    return "bought";
}

// ---- Gem powers ----

const MINUTE = 60;
const HOUR = 3600;

export const BOOST_COST = 5;
export const BOOST_SECONDS = 30 * MINUTE;
/** Buying the boost again adds time, up to this much in total */
export const BOOST_MAX_SECONDS = 4 * HOUR;

export const COMBO_KEEPER_COST = 3;
export const COMBO_KEEPER_SECONDS = 10 * MINUTE;
export const COMBO_KEEPER_MAX_SECONDS = HOUR;

export const SHOWER_COST = 3;
export const SHOWER_EFFECTS = 5;

export const DISCOVERY_COST = 3;
export const DISCOVERY_EMOJIS = 10;

export const TIME_WARPS = [
    { hours: 1, cost: 8 },
    { hours: 4, cost: 25 },
];

export const ESSENCE_CHARM_COST = 20;
export const RESPEC_COST = 15;

/** Adds time to a timer that may still be running, up to a cap */
function extend(secondsLeft: number, add: number, max: number) {
    return Date.now() + Math.min(max, secondsLeft + add) * 1000;
}

export const canBuyBoost = () => boostSecondsLeft() + BOOST_SECONDS <= BOOST_MAX_SECONDS;

/** ×2 production and taps for 30 minutes; buying again adds 30 minutes */
export function buyBoost(): GemBuyResult {
    if (!canBuyBoost()) return "unavailable";
    const paid = pay(BOOST_COST);
    if (paid !== "bought") return paid;
    store.dispatch(setBoostUntil(extend(boostSecondsLeft(), BOOST_SECONDS, BOOST_MAX_SECONDS)));
    calculateEmojisPerSecond();
    calculateEpt();
    return "bought";
}

export const canBuyComboKeeper = () => hasCombo() && comboKeeperSecondsLeft() + COMBO_KEEPER_SECONDS <= COMBO_KEEPER_MAX_SECONDS;

/** The combo doesn't drain for 10 minutes */
export function buyComboKeeper(): GemBuyResult {
    if (!canBuyComboKeeper()) return "unavailable";
    const paid = pay(COMBO_KEEPER_COST);
    if (paid !== "bought") return paid;
    store.dispatch(setComboKeeperUntil(extend(comboKeeperSecondsLeft(), COMBO_KEEPER_SECONDS, COMBO_KEEPER_MAX_SECONDS)));
    return "bought";
}

export const canBuyShower = () => canSpawnEffects() && hasEffectEmojis();

/** Five good effect emojis appear at once */
export function buyShower(): GemBuyResult {
    if (!canBuyShower()) return "unavailable";
    const paid = pay(SHOWER_COST);
    if (paid !== "bought") return paid;
    for (let i = 0; i < SHOWER_EFFECTS; i++) {
        let effect = createEffect();
        // Only good ones: it was paid for
        for (let tries = 0; effect.quality !== "good" && tries < 20; tries++) effect = createEffect();
        store.dispatch(addEffectOnScreen(effect));
    }
    store.dispatch(updateTimeSinceLastEffect(0));
    return "bought";
}

export const canBuyDiscovery = () => hasUndiscoveredEmojis();

/** The next 10 Big Emojis are ones never found before */
export function buyDiscovery(): GemBuyResult {
    if (!canBuyDiscovery()) return "unavailable";
    const paid = pay(DISCOVERY_COST);
    if (paid !== "bought") return paid;
    // From the one after the emoji already up next
    store.dispatch(addDiscoveries(DISCOVERY_EMOJIS));
    return "bought";
}

/** Emojis a time warp gives: that many hours of production, right away */
export const timeWarpEmojis = (hours: number) => calculateBaseEmojisPerSecond() * hours * HOUR;

export const canBuyTimeWarp = () => calculateBaseEmojisPerSecond() > 0;

export function buyTimeWarp(hours: number): GemBuyResult {
    const warp = TIME_WARPS.find(w => w.hours === hours);
    if (!warp || !canBuyTimeWarp()) return "unavailable";
    const paid = pay(warp.cost);
    if (paid !== "bought") return paid;
    const earned = timeWarpEmojis(hours);
    giveOneOffEmojis(earned);
    creditBuildings(earned);
    return "bought";
}

// ---- Prestige extras ----

export const canBuyEssenceCharm = () => !store.getState().gems.essenceCharm;

/** The next prestige gives 25% more essence */
export function buyEssenceCharm(): GemBuyResult {
    if (!canBuyEssenceCharm()) return "unavailable";
    const paid = pay(ESSENCE_CHARM_COST);
    if (paid !== "bought") return paid;
    store.dispatch(setEssenceCharm(true));
    return "bought";
}

export const canRespec = () => store.getState().prestige.perks.length > 0;

/** Takes back every perk and returns its essence, to spend again differently */
export function buyRespec(): GemBuyResult {
    if (!canRespec()) return "unavailable";
    const paid = pay(RESPEC_COST);
    if (paid !== "bought") return paid;
    const owned = store.getState().prestige.perks;
    store.dispatch(refundPerks(perks.filter(perk => owned.includes(perk.id)).map(({ id, cost }) => ({ id, cost }))));
    // Unspent essence boosts production again, and some perks changed prices
    syncBuildingPrices();
    calculateBuildingsEps();
    calculateEpt();
    return "bought";
}

// ---- App themes ----

export const ownsTheme = (id: string) => themeById(id).price === 0 || (store.getState().gems.themes ?? []).includes(id);

/** Buys a theme if it isn't owned yet, then puts it on */
export function buyTheme(id: string): GemBuyResult {
    const theme = themeById(id);
    if (!ownsTheme(theme.id)) {
        const paid = pay(theme.price);
        if (paid !== "bought") return paid;
        store.dispatch(unlockTheme(theme.id));
    }
    store.dispatch(setTheme(theme.id));
    return "bought";
}
