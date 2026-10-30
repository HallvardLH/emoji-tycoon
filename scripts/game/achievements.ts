import store, { RootState } from "../redux/reduxStore";
import { unlockAchievements } from "../redux/achievementsSlice";
import { buildingData } from "./buildings/buildingData";
import { perks } from "./prestige/perks";
import { trials } from "./prestige/trials";
import { emojiCategories } from "./collection/emojiCategories";
import { isCollectible } from "./collection/emojiSupport";
import { celebrateMilestone } from "./milestones";
import i18n from "../../i18n";
import { getTrophyText } from "../../i18n/content";
import { toCaps } from "../utils";

/**
 * Achievements: long-term goals across everything the game tracks
 *
 * They're all-time (kept through prestige) and give no bonus: they're there to
 * point at what's left to do and mark the way. Checked every 2.5 s from the gameLoop.
 */

/**
 * A trophy's text: a key under "trophies" in the ui translations, and the values it's
 * filled in with. They stay raw (numbers, ids) and are formatted when shown, in the
 * player's language (see getTrophyText)
 */
export interface TrophyText {
    key: string;
    amount?: number;
    buildingId?: number;
    trialId?: string;
    /** Building trophy tier, a key under "trophies.tiers" */
    tier?: string;
}

export interface Achievement {
    id: string;
    group: AchievementGroup;
    icon: string;
    name: TrophyText;
    description: TrophyText;
    /** Every locked one shows as ???; a secret one also hints that it's a secret */
    secret?: boolean;
    /** No banner of its own, as another one celebrates the same moment (bank milestones, the first building) */
    quiet?: boolean;
    unlocked: (state: RootState) => boolean;
}

export type AchievementGroup = "Emojis" | "Production" | "Tapping" | "Buildings" | "Collection" | "Magic" | "Prestige" | "Secret";

export const achievementGroups: { group: AchievementGroup, icon: string }[] = [
    { group: "Emojis", icon: "✍️" },
    { group: "Production", icon: "⚡" },
    { group: "Tapping", icon: "👆" },
    { group: "Buildings", icon: "🏗️" },
    { group: "Collection", icon: "📖" },
    { group: "Magic", icon: "✨" },
    { group: "Prestige", icon: "🔮" },
    { group: "Secret", icon: "🤫" },
];

// ---- Helpers ----

const totalBuildings = (state: RootState) => state.buildings.buildings.reduce((sum, b) => sum + b.amount, 0);
const ownedOf = (state: RootState, name: string) => state.buildings.buildings.find(b => b.name === name)?.amount ?? 0;

// Collected emojis are counted once per check, not once per achievement
let collectedCache: { collection: RootState["collection"], count: number } | undefined;
function collectedCount(state: RootState) {
    if (collectedCache?.collection !== state.collection) {
        // Only ones this device can show, like the collection and its total
        const count = Object.entries(state.collection)
            .reduce((sum, [category, list]) => sum + (list as ({ amount: number } | null)[])
                .filter((entry, index) => (entry?.amount ?? 0) > 0 && isCollectible(category, index)).length, 0);
        collectedCache = { collection: state.collection, count };
    }
    return collectedCache.count;
}

/** Every emoji that can show up on the Big Emoji (on this device) */
let collectibleTotal: number | undefined;
export function collectibleCount() {
    collectibleTotal ??= Object.entries(emojiCategories)
        .reduce((sum, [category, list]) => sum + list.filter((_, index) => isCollectible(category, index)).length, 0);
    return collectibleTotal;
}

// ---- The achievements ----

const DRAWN_ICONS = ["🎈", "🎉", "🏆", "💎", "👑", "🚀", "🌌", "🪐", "🌠", "♾️", "🔱"];

// One per power of 1000 (a thousand up to a decillion), matching the bank milestones (which give the banner)
const drawn: Achievement[] = DRAWN_ICONS.map((icon, i) => ({
    id: `drawn${i + 1}`,
    group: "Emojis",
    icon,
    name: { key: `names.drawn${i + 1}` },
    description: { key: "descriptions.drawn", amount: Math.pow(1000, i + 1) },
    quiet: true,
    unlocked: state => state.stats.emojisGained >= Math.pow(1000, i + 1),
}));

const PRODUCTION: [number, string][] = [
    [10, "🚰"],
    [1e3, "🌊"],
    [1e6, "🏞️"],
    [1e9, "🌀"],
    [1e12, "🌋"],
    [1e15, "☄️"],
    [1e18, "🌞"],
    [1e21, "💫"],
    [1e24, "🕳️"],
];
const production: Achievement[] = PRODUCTION.map(([amount, icon], i) => ({
    id: `eps${i + 1}`,
    group: "Production",
    icon,
    name: { key: `names.eps${i + 1}` },
    description: { key: "descriptions.eps", amount },
    unlocked: state => state.values.emojisPerSecond >= amount,
}));

const TAPS: [number, string][] = [
    [100, "👆"],
    [1_000, "✌️"],
    [10_000, "🤌"],
    [50_000, "🥁"],
    [100_000, "🦾"],
    [500_000, "🪨"],
];
const COMBOS: [number, string][] = [
    [3, "🔥"],
    [5, "⚡"],
    [8, "🌟"],
];
const tapping: Achievement[] = [
    ...TAPS.map(([taps, icon], i): Achievement => ({
        id: `taps${i + 1}`,
        group: "Tapping",
        icon,
        name: { key: `names.taps${i + 1}` },
        description: { key: "descriptions.taps", amount: taps },
        unlocked: state => state.stats.bigEmojiTaps >= taps,
    })),
    ...COMBOS.map(([combo, icon]): Achievement => ({
        id: `combo${combo}`,
        group: "Tapping",
        icon,
        name: { key: `names.combo${combo}` },
        description: { key: "descriptions.combo", amount: combo },
        unlocked: state => (state.stats.bestCombo ?? 1) >= combo,
    })),
    {
        id: "tapEarnings",
        group: "Tapping",
        icon: "💪",
        name: { key: "names.tapEarnings" },
        description: { key: "descriptions.tapEarnings", amount: 1e12 },
        unlocked: state => state.stats.emojisEarnedFromTap >= 1e12,
    },
];

// Owning a few of each building, then a lot
const BUILDING_TIERS: [number, string][] = [[1, "hired"], [50, "fifty"], [100, "century"], [200, "empire"]];
const buildings: Achievement[] = [
    ...buildingData.flatMap(building => BUILDING_TIERS.map(([amount, label], tier): Achievement => ({
        id: `building-${building.name}-${amount}`,
        group: "Buildings",
        icon: building.icon,
        name: { key: "names.building", buildingId: building.buildingId, tier: label },
        description: amount === 1
            ? { key: "descriptions.buildingFirst", buildingId: building.buildingId }
            : { key: "descriptions.buildingOwned", buildingId: building.buildingId, amount },
        // The first of each building has its own banner ("Your first farm!")
        quiet: tier === 0,
        unlocked: state => ownedOf(state, building.name) >= amount,
    }))),
    ...([[100, "🏘️"], [500, "🏙️"], [1000, "🌆"], [2500, "🌍"]] as [number, string][])
        .map(([amount, icon]): Achievement => ({
            id: `buildings${amount}`,
            group: "Buildings",
            icon,
            name: { key: `names.buildings${amount}` },
            description: { key: "descriptions.buildingsTotal", amount },
            unlocked: state => totalBuildings(state) >= amount,
        })),
    ...([[10, "🔧"], [50, "🛠️"], [150, "⚙️"], [300, "🧠"]] as [number, string][])
        .map(([amount, icon]): Achievement => ({
            id: `upgrades${amount}`,
            group: "Buildings",
            icon,
            name: { key: `names.upgrades${amount}` },
            description: { key: "descriptions.upgradesOwned", amount },
            unlocked: state => state.upgrades.owned.length >= amount,
        })),
];

const COLLECTED: [number, string][] = [
    [50, "📗"],
    [250, "📚"],
    [500, "🗃️"],
    [1000, "🏛️"],
];
const SHINIES: [number, string][] = [
    [1, "✨"],
    [10, "🌟"],
    [50, "💛"],
];
const collection: Achievement[] = [
    ...COLLECTED.map(([amount, icon]): Achievement => ({
        id: `collected${amount}`,
        group: "Collection",
        icon,
        name: { key: `names.collected${amount}` },
        description: { key: "descriptions.collected", amount },
        unlocked: state => collectedCount(state) >= amount,
    })),
    {
        id: "collectedAll",
        group: "Collection",
        icon: "🏆",
        name: { key: "names.collectedAll" },
        description: { key: "descriptions.collectedAll" },
        unlocked: state => collectedCount(state) >= collectibleCount(),
    },
    ...SHINIES.map(([amount, icon]): Achievement => ({
        id: `shiny${amount}`,
        group: "Collection",
        icon,
        name: { key: `names.shiny${amount}` },
        description: amount === 1 ? { key: "descriptions.shinyFirst" } : { key: "descriptions.shiny", amount },
        unlocked: state => (state.stats.shinyEmojisTapped ?? 0) >= amount,
    })),
];

const MAGIC: [number, string][] = [
    [1, "🪄"],
    [25, "🔮"],
    [100, "🧙"],
    [500, "🌠"],
];
const magic: Achievement[] = MAGIC.map(([amount, icon]) => ({
    id: `magic${amount}`,
    group: "Magic",
    icon,
    name: { key: `names.magic${amount}` },
    description: amount === 1 ? { key: "descriptions.magicFirst" } : { key: "descriptions.magic", amount },
    unlocked: state => state.stats.effectEmojisCollected >= amount,
}));

const PRESTIGES: [number, string][] = [
    [1, "🌱"],
    [5, "🔁"],
    [10, "♻️"],
    [25, "🌀"],
];
const prestige: Achievement[] = [
    ...PRESTIGES.map(([amount, icon]): Achievement => ({
        id: `prestige${amount}`,
        group: "Prestige",
        icon,
        name: { key: `names.prestige${amount}` },
        description: amount === 1 ? { key: "descriptions.prestigeFirst" } : { key: "descriptions.prestige", amount },
        unlocked: state => state.prestige.prestiges >= amount,
    })),
    ...trials.map((trial): Achievement => ({
        id: `trial-${trial.id}`,
        group: "Prestige",
        icon: trial.icon,
        name: { key: "names.trial", trialId: trial.id },
        description: { key: "descriptions.trial", trialId: trial.id },
        unlocked: state => (state.prestige.trialsCompleted ?? []).includes(trial.id),
    })),
    {
        id: "allPerks",
        group: "Prestige",
        icon: "👑",
        name: { key: "names.allPerks" },
        description: { key: "descriptions.allPerks" },
        unlocked: state => perks.every(perk => state.prestige.perks.includes(perk.id)),
    },
];

const secret: Achievement[] = [
    {
        id: "secretAnswer",
        group: "Secret",
        icon: "🐬",
        name: { key: "names.secretAnswer" },
        description: { key: "descriptions.secretAnswer", amount: 42 },
        secret: true,
        unlocked: state => state.values.funValue === 42,
    },
    {
        id: "secretHoarder",
        group: "Secret",
        icon: "🐉",
        name: { key: "names.secretHoarder" },
        description: { key: "descriptions.secretHoarder", amount: 1e6 },
        secret: true,
        unlocked: state => state.values.emojis >= 1e6 && totalBuildings(state) === 0,
    },
    {
        id: "secretGems",
        group: "Secret",
        icon: "💎",
        name: { key: "names.secretGems" },
        description: { key: "descriptions.secretGems", amount: 100 },
        secret: true,
        unlocked: state => state.gems.gems >= 100,
    },
];

export const achievements: Achievement[] = [
    ...drawn,
    ...production,
    ...tapping,
    ...buildings,
    ...collection,
    ...magic,
    ...prestige,
    ...secret,
];

// Trophy banners come at most this often. Early in a game several trophies land within
// seconds of each other (nearly every tap collects a new emoji), and a banner each was a flood
const TROPHY_BANNER_GAP_MS = 60_000;

// Unlocked, waiting for their banner
let waiting: Achievement[] = [];
let lastBannerAt = 0;

/** One banner for the trophies waiting, however many: "Poke · Hoarder" */
function showWaitingTrophies() {
    if (waiting.length === 0 || Date.now() - lastBannerAt < TROPHY_BANNER_GAP_MS) return;
    celebrateMilestone({
        icon: waiting[0].icon,
        caption: toCaps(i18n.t(waiting.length === 1 ? "trophies.unlockedCaps" : "trophies.unlockedManyCaps")),
        title: waiting.map(a => getTrophyText(a.name)).join(" · "),
        kind: "trophy",
    });
    waiting = [];
    lastBannerAt = Date.now();
}

/**
 * Unlocks every achievement that's been earned (except on a save's first check, see
 * achievementsSlice). Their banners are spaced out: trophies earned while one is due
 * wait and share the next banner
 *
 * Called every 2.5 s from the gameLoop
 */
export function checkAchievements() {
    const state = store.getState();
    const { unlocked, checked } = state.achievements;
    const earned = achievements.filter(a => !unlocked.includes(a.id) && a.unlocked(state));
    if (earned.length === 0) {
        if (!checked) store.dispatch(unlockAchievements([]));
        showWaitingTrophies();
        return;
    }

    store.dispatch(unlockAchievements(earned.map(a => a.id)));
    if (!checked) return;
    waiting.push(...earned.filter(a => !a.quiet));
    showWaitingTrophies();
}

/** Forgets trophies waiting for a banner, for a reset game */
export function clearWaitingTrophies() {
    waiting = [];
}
