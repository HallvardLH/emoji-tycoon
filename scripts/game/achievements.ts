import store, { RootState } from "../redux/reduxStore";
import { unlockAchievements } from "../redux/achievementsSlice";
import { buildingData } from "./buildings/buildingData";
import { perks } from "./prestige/perks";
import { trials } from "./prestige/trials";
import { emojiCategories } from "./collection/emojiCategories";
import { effectEmojis } from "./effects/effectData";
import { celebrateMilestone } from "./milestones";
import { formatNumber } from "../misc";

/**
 * Achievements: long-term goals across everything the game tracks
 *
 * They're all-time (kept through prestige) and give no bonus: they're there to
 * point at what's left to do and mark the way. Checked every 2.5 s from the gameLoop.
 */

export interface Achievement {
    id: string;
    group: AchievementGroup;
    icon: string;
    name: string;
    description: string;
    /** Shown as ??? until unlocked */
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
        const count = Object.values(state.collection)
            .reduce((sum, list) => sum + (list as ({ amount: number } | null)[]).filter(entry => (entry?.amount ?? 0) > 0).length, 0);
        collectedCache = { collection: state.collection, count };
    }
    return collectedCache.count;
}

/** Every emoji that can show up on the Big Emoji */
let collectibleTotal: number | undefined;
export function collectibleCount() {
    collectibleTotal ??= Object.values(emojiCategories)
        .reduce((sum, list) => sum + list.filter(emoji => !effectEmojis.includes(emoji)).length, 0);
    return collectibleTotal;
}

// ---- The achievements ----

const NUMBER_NAMES = ["thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
const DRAWN_ICONS = ["🎈", "🎉", "🏆", "💎", "👑", "🚀", "🌌", "🪐", "🌠", "♾️", "🔱"];
const DRAWN_NAMES = ["Doodler", "Sketchbook", "Mural", "Gallery", "Masterpiece", "Renaissance", "Museum of everything", "Emoji cosmos", "Infinite canvas", "Beyond counting", "The last page"];

// One per power of 1000, matching the bank milestones (which give the banner)
const drawn: Achievement[] = NUMBER_NAMES.map((word, i) => ({
    id: `drawn${i + 1}`,
    group: "Emojis",
    icon: DRAWN_ICONS[i],
    name: DRAWN_NAMES[i],
    description: `Draw 1 ${word} emojis in total`,
    quiet: true,
    unlocked: state => state.stats.emojisGained >= Math.pow(1000, i + 1),
}));

const PRODUCTION: [number, string, string][] = [
    [10, "🚰", "Trickle"],
    [1e3, "🌊", "Stream"],
    [1e6, "🏞️", "River"],
    [1e9, "🌀", "Torrent"],
    [1e12, "🌋", "Eruption"],
    [1e15, "☄️", "Meteor shower"],
    [1e18, "🌞", "Solar flare"],
    [1e21, "💫", "Supernova"],
    [1e24, "🕳️", "Event horizon"],
];
const production: Achievement[] = PRODUCTION.map(([amount, icon, name], i) => ({
    id: `eps${i + 1}`,
    group: "Production",
    icon,
    name,
    description: `Make ${formatNumber(amount, 0)} emojis per second`,
    unlocked: state => state.values.emojisPerSecond >= amount,
}));

const TAPS: [number, string, string][] = [
    [100, "👆", "Poke"],
    [1_000, "✌️", "Fidget"],
    [10_000, "🤌", "Tap dancer"],
    [50_000, "🥁", "Drum roll"],
    [100_000, "🦾", "Bionic finger"],
    [500_000, "🪨", "Carpal tunnel"],
];
const COMBOS: [number, string, string][] = [
    [3, "🔥", "Combo!"],
    [5, "⚡", "Hot hands"],
    [8, "🌟", "Supernova combo"],
];
const tapping: Achievement[] = [
    ...TAPS.map(([taps, icon, name], i): Achievement => ({
        id: `taps${i + 1}`,
        group: "Tapping",
        icon,
        name,
        description: `Tap the Big Emoji ${formatNumber(taps)} times`,
        unlocked: state => state.stats.bigEmojiTaps >= taps,
    })),
    ...COMBOS.map(([combo, icon, name]): Achievement => ({
        id: `combo${combo}`,
        group: "Tapping",
        icon,
        name,
        description: `Reach a ×${combo} combo`,
        unlocked: state => (state.stats.bestCombo ?? 1) >= combo,
    })),
    {
        id: "tapEarnings",
        group: "Tapping",
        icon: "💪",
        name: "Hands-on management",
        description: "Earn 1 trillion emojis from tapping",
        unlocked: state => state.stats.emojisEarnedFromTap >= 1e12,
    },
];

// Owning a few of each building, then a lot
const BUILDING_TIERS: [number, string][] = [[1, "Hired"], [50, "Fifty"], [100, "Century"], [200, "Empire"]];
const buildings: Achievement[] = [
    ...buildingData.flatMap(building => BUILDING_TIERS.map(([amount, label], tier): Achievement => ({
        id: `building-${building.name}-${amount}`,
        group: "Buildings",
        icon: building.icon,
        name: `${building.name}: ${label}`,
        description: amount === 1 ? `Get your first ${building.name.toLowerCase()}` : `Own ${amount} of ${building.name.toLowerCase()}`,
        // The first building has its own banner
        quiet: building.buildingId === 0 && tier === 0,
        unlocked: state => ownedOf(state, building.name) >= amount,
    }))),
    ...([[100, "🏘️", "Small business"], [500, "🏙️", "Conglomerate"], [1000, "🌆", "Megacorp"], [2500, "🌍", "World domination"]] as [number, string, string][])
        .map(([amount, icon, name]): Achievement => ({
            id: `buildings${amount}`,
            group: "Buildings",
            icon,
            name,
            description: `Own ${formatNumber(amount)} buildings at once`,
            unlocked: state => totalBuildings(state) >= amount,
        })),
    ...([[10, "🔧", "Tinkerer"], [50, "🛠️", "Engineer"], [150, "⚙️", "Inventor"], [300, "🧠", "Mad scientist"]] as [number, string, string][])
        .map(([amount, icon, name]): Achievement => ({
            id: `upgrades${amount}`,
            group: "Buildings",
            icon,
            name,
            description: `Own ${amount} upgrades at once`,
            unlocked: state => state.upgrades.owned.length >= amount,
        })),
];

const COLLECTED: [number, string, string][] = [
    [50, "📗", "Collector"],
    [250, "📚", "Hoarder"],
    [500, "🗃️", "Archivist"],
    [1000, "🏛️", "Curator"],
];
const SHINIES: [number, string, string][] = [
    [1, "✨", "Ooh, shiny"],
    [10, "🌟", "Magpie"],
    [50, "💛", "Gold rush"],
];
const collection: Achievement[] = [
    ...COLLECTED.map(([amount, icon, name]): Achievement => ({
        id: `collected${amount}`,
        group: "Collection",
        icon,
        name,
        description: `Find ${formatNumber(amount)} different emojis`,
        unlocked: state => collectedCount(state) >= amount,
    })),
    {
        id: "collectedAll",
        group: "Collection",
        icon: "🏆",
        name: "Gotta tap 'em all",
        description: "Find every emoji",
        unlocked: state => collectedCount(state) >= collectibleCount(),
    },
    ...SHINIES.map(([amount, icon, name]): Achievement => ({
        id: `shiny${amount}`,
        group: "Collection",
        icon,
        name,
        description: amount === 1 ? "Tap a shiny emoji" : `Tap ${amount} shiny emojis`,
        unlocked: state => (state.stats.shinyEmojisTapped ?? 0) >= amount,
    })),
];

const MAGIC: [number, string, string][] = [
    [1, "🪄", "Abracadabra"],
    [25, "🔮", "Apprentice"],
    [100, "🧙", "Wizard"],
    [500, "🌠", "Archmage"],
];
const magic: Achievement[] = MAGIC.map(([amount, icon, name]) => ({
    id: `magic${amount}`,
    group: "Magic",
    icon,
    name,
    description: amount === 1 ? "Tap an effect emoji" : `Tap ${amount} effect emojis`,
    unlocked: state => state.stats.effectEmojisCollected >= amount,
}));

const PRESTIGES: [number, string, string][] = [
    [1, "🌱", "Born again"],
    [5, "🔁", "Groundhog day"],
    [10, "♻️", "Recycler"],
    [25, "🌀", "Eternal return"],
];
const prestige: Achievement[] = [
    ...PRESTIGES.map(([amount, icon, name]): Achievement => ({
        id: `prestige${amount}`,
        group: "Prestige",
        icon,
        name,
        description: amount === 1 ? "Prestige for the first time" : `Prestige ${amount} times`,
        unlocked: state => state.prestige.prestiges >= amount,
    })),
    ...trials.map((trial): Achievement => ({
        id: `trial-${trial.id}`,
        group: "Prestige",
        icon: trial.icon,
        name: `${trial.name} survivor`,
        description: `Complete the ${trial.name} trial`,
        unlocked: state => (state.prestige.trialsCompleted ?? []).includes(trial.id),
    })),
    {
        id: "allPerks",
        group: "Prestige",
        icon: "👑",
        name: "Perfectly perked",
        description: "Own every perk",
        unlocked: state => perks.every(perk => state.prestige.perks.includes(perk.id)),
    },
];

const secret: Achievement[] = [
    {
        id: "secretAnswer",
        group: "Secret",
        icon: "🐬",
        name: "Don't panic",
        description: "Play with a fun value of 42",
        secret: true,
        unlocked: state => state.values.funValue === 42,
    },
    {
        id: "secretHoarder",
        group: "Secret",
        icon: "🐉",
        name: "Dragon's hoard",
        description: "Have 1 million emojis in the bank without owning a building",
        secret: true,
        unlocked: state => state.values.emojis >= 1e6 && totalBuildings(state) === 0,
    },
    {
        id: "secretGems",
        group: "Secret",
        icon: "💎",
        name: "Shiny rocks",
        description: "Hold 100 gems at once",
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

/**
 * Unlocks every achievement that's been earned, with a banner for each new one
 * (except on a save's first check, see achievementsSlice)
 *
 * Called every 2.5 s from the gameLoop
 */
export function checkAchievements() {
    const state = store.getState();
    const { unlocked, checked } = state.achievements;
    const earned = achievements.filter(a => !unlocked.includes(a.id) && a.unlocked(state));
    if (earned.length === 0) {
        if (!checked) store.dispatch(unlockAchievements([]));
        return;
    }

    store.dispatch(unlockAchievements(earned.map(a => a.id)));
    if (!checked) return;
    earned.filter(a => !a.quiet).forEach(a => celebrateMilestone({ icon: a.icon, caption: "TROPHY UNLOCKED", title: a.name }));
}
