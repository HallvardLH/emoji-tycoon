import emojiVersions from "../../../assets/emojis/emojiVersions.json";
import { emojiCategories } from "./emojiCategories";
import { isCollectible } from "./emojiSupport";

/**
 * Emoji rarity
 *
 * Every collectible emoji has a rarity, from common to legendary, that sets how often
 * it turns up on the Big Emoji. It's worked out from the emoji itself, so it's the same
 * for every player and every save, and needs nothing stored:
 *
 * 1. Legendary: a hand-picked few of the most iconic treasures, myths and wonders.
 * 2. Epic: a hand-picked set of special ones, and the newest emojis (Emoji 14 and up).
 * 3. Newer emojis are rarer, as they haven't spread as far yet: Emoji 12 - 13.1 are
 *    rare, Emoji 5 - 11 uncommon.
 * 4. The classics (the original emoji set) are mostly common, but a share of them is
 *    uncommon or rare, fixed by a hash of the emoji, so the grid isn't all common.
 *
 * Each emoji's chance is its rarity's weight times its category's bias (faces turn up a
 * little more, symbols a little less), out of all collectible emojis. With these weights
 * a given legendary turns up about once in 30,000 - 60,000 taps, some legendary or other
 * about once in 1,400, and the whole collection takes about 200,000 taps to complete.
 */

export const RARITIES = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type Rarity = typeof RARITIES[number];

/** Relative chance of each rarity's emojis */
const RARITY_WEIGHTS: Record<Rarity, number> = {
    common: 100,
    uncommon: 45,
    rare: 20,
    epic: 7,
    legendary: 2.5,
};

/** Each rarity's color, for the Emojidex and the new find burst */
export const RARITY_COLORS: Record<Rarity, string> = {
    common: "#B9B3CC",
    uncommon: "#4ADE80",
    rare: "#60A5FA",
    epic: "#C084FC",
    legendary: "#FBBF24",
};

/** Finding a new emoji of at least this rarity gets a celebration */
export const CELEBRATED_RARITY: Rarity = "rare";

/** How much more or less often a category's emojis turn up, whatever their rarity */
const CATEGORY_BIAS: Record<string, number> = {
    faces: 1.5,
    animals: 1.25,
    food: 1.25,
    objects: 1,
    people: 0.85,
    bodyParts: 1,
    placesBuildings: 1,
    plants: 1,
    vehicles: 1,
    weather: 1,
    symbols: 0.75,
};

const LEGENDARY = new Set([
    // Myths and magic
    "🦄", "🐉", "🐲", "🧞", "🧚", "🧜", "🧙", "👼", "🔮", "🪄", "🍄",
    // Treasure
    "👑", "💎", "💰", "🏆", "🍯",
    // Wonders of the world and beyond
    "🗿", "🏰", "🌋", "🌈", "🌌", "☄️", "🌠", "🛸", "👽", "🦖", "🐳", "🔱", "♾️",
]);

const EPIC = new Set([
    "🦕", "🦚", "🦋", "🦢", "🐋", "🌟", "🌞", "🌕", "🌙", "💫", "🌀", "⚡", "🔥",
    "🎆", "🎇", "🥇", "🃏", "🎩", "💍", "🗝️", "🪙", "🧿", "🪬", "⚜️",
    "🧛", "🧝", "🎠", "🏯", "🗽", "🗼", "🛕", "🌅",
]);

// Share of the classics that's common, then uncommon; the rest are rare
const CLASSIC_COMMON = 70;
const CLASSIC_UNCOMMON = 92;

const versions = emojiVersions as Record<string, Record<string, number>>;

/** A stable hash of the emoji (FNV-1a), so its rarity never changes between versions of the game */
function hash(emoji: string) {
    let h = 0x811c9dc5;
    for (let i = 0; i < emoji.length; i++) {
        h ^= emoji.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
}

function workOutRarity(category: string, index: number): Rarity {
    const emoji = emojiCategories[category][index];
    const version = versions[category]?.[index] ?? 0;
    if (LEGENDARY.has(emoji)) return "legendary";
    if (EPIC.has(emoji) || version >= 14) return "epic";
    if (version >= 12) return "rare";
    if (version >= 5) return "uncommon";
    const bucket = hash(emoji) % 100;
    return bucket < CLASSIC_COMMON ? "common" : bucket < CLASSIC_UNCOMMON ? "uncommon" : "rare";
}

const rarityCache: Record<string, Rarity[]> = {};

/** The rarity of the emoji at this index of a collection category */
export function rarityOf(category: string, index: number): Rarity {
    rarityCache[category] ??= emojiCategories[category].map((_, i) => workOutRarity(category, i));
    return rarityCache[category][index] ?? "common";
}

/** How likely the emoji is to be picked, relative to the others */
export const pickWeight = (category: string, index: number) =>
    RARITY_WEIGHTS[rarityOf(category, index)] * (CATEGORY_BIAS[category] ?? 1);

export const isAtLeast = (rarity: Rarity, than: Rarity) => RARITIES.indexOf(rarity) >= RARITIES.indexOf(than);

export interface Pickable {
    emoji: string;
    category: string;
    index: number;
}

/** Picks one of these emojis at random, by their rarity and category weights */
export function pickWeighted<T extends Pickable>(emojis: T[]): T | undefined {
    const total = emojis.reduce((sum, e) => sum + pickWeight(e.category, e.index), 0);
    let roll = Math.random() * total;
    for (const e of emojis) {
        roll -= pickWeight(e.category, e.index);
        if (roll < 0) return e;
    }
    return emojis[emojis.length - 1];
}

// Every collectible emoji with its running total weight, worked out once, for picking fast on every tap
let pool: { entries: Pickable[], cumulative: number[], total: number } | undefined;

function getPool() {
    if (pool) return pool;
    const entries: Pickable[] = [];
    const cumulative: number[] = [];
    let total = 0;
    Object.keys(emojiCategories).forEach(category => {
        emojiCategories[category].forEach((emoji, index) => {
            if (!isCollectible(category, index)) return;
            total += pickWeight(category, index);
            entries.push({ emoji, category, index });
            cumulative.push(total);
        });
    });
    pool = { entries, cumulative, total };
    return pool;
}

/** A random collectible emoji, by rarity and category */
export function pickRandomEmoji(): Pickable {
    const { entries, cumulative, total } = getPool();
    const roll = Math.random() * total;
    // Binary search for the first running total past the roll
    let low = 0, high = cumulative.length - 1;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (cumulative[mid] > roll) high = mid;
        else low = mid + 1;
    }
    return entries[low];
}
