import store from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { updateBigEmoji, updateNextEmoji } from '../redux/bigEmojiSlice';
import { addToCollection, CollectionState } from '../redux/collectionSlice';
import faces from '../../assets/emojis/faces.json';
import symbols from '../../assets/emojis/symbols.json';
import people from '../../assets/emojis/people.json';
import animals from '../../assets/emojis/animals.json';
import food from '../../assets/emojis/food.json';
import bodyParts from '../../assets/emojis/bodyParts.json';
import objects from '../../assets/emojis/objects.json';
import placesBuildings from '../../assets/emojis/placesBuildings.json';
import plants from '../../assets/emojis/plants.json';
import vehicles from '../../assets/emojis/vehicles.json';
import weather from '../../assets/emojis/weather.json';
import { updateTapStats, addShinyEmojiTapped } from '../redux/statsSlice';
import { incrementTapBoost, getComboProgress } from './tapBoost';
import { calculateEpt } from './calculations';
import { howFun } from './shorthands';
import { shinyChanceMultiplier, shinyRewardMultiplier } from './prestige/perks';
import { isTrialActive } from './prestige/trials';
import { addDiscoveries } from '../redux/gemsSlice';
import { checkTapGem } from './gems/gemRewards';
import { isCollectible } from './collection/emojiSupport';

/** Chance that a new Big Emoji is shiny */
export const SHINY_CHANCE = 1 / 200;
/** Shiny emojis only start appearing once this many emojis have been produced, all-time */
export const SHINY_FROM_EMOJIS_PRODUCED = 10_000;
// Cheat: every Big Emoji is shiny
let alwaysShiny = false;

export function isAlwaysShiny() {
    return alwaysShiny;
}

export function setAlwaysShiny(on: boolean) {
    alwaysShiny = on;
    // Apply to the emoji on screen right away, not just from the next tap
    const { bigEmoji, nextEmoji } = store.getState().bigEmoji;
    store.dispatch(updateBigEmoji({ ...bigEmoji, shiny: on }));
    store.dispatch(updateNextEmoji({ ...nextEmoji, shiny: on }));
}

/**
 * What tapping a shiny emoji is worth: 50 taps, or a minute of production if that's more.
 * Golden touch (perk) multiplies it; in the Hands off trial it's worth nothing, like any tap.
 */
function getShinyReward(emojisPerTap: number, emojisPerSecond: number) {
    if (isTrialActive("handsOff")) return 0;
    return Math.max(emojisPerTap * 50, emojisPerSecond * 60) * shinyRewardMultiplier();
}

/**
 * Taps the Big Emoji, which then becomes the next emoji
 *
 * @returns the bonus given if the tapped emoji was shiny, and whether this tap earned a gem
 */
export function tapEmoji(): { shinyReward?: number, tapGem: boolean } {
    const state = store.getState();
    const { emojis, emojisPerSecond } = state.values;
    const { emojisPerTap, bigEmoji, nextEmoji } = state.bigEmoji;

    const shinyReward = bigEmoji.shiny ? getShinyReward(emojisPerTap, emojisPerSecond) : 0;
    const gained = emojisPerTap + shinyReward;
    // Counts towards combo level upgrades, weighted by the combo this tap was made at
    const { multiplier: comboMultiplier } = getComboProgress(state.bigEmoji.tapBoost);

    store.dispatch((dispatch) => {
        dispatch(updateEmojis(emojis + gained));
        dispatch(updateTapStats({
            emojisGained: gained,
            bigEmojiTaps: 1,
            emojisEarnedFromTap: gained,
            comboTaps: comboMultiplier,
        }));
        dispatch(updateBigEmoji({
            emoji: nextEmoji.emoji,
            category: nextEmoji.category,
            id: nextEmoji.id,
            shiny: nextEmoji.shiny,
        }));
        dispatch(addToCollection({
            category: bigEmoji.category as keyof CollectionState,
            id: bigEmoji.id,
            shiny: bigEmoji.shiny,
        }));
        if (bigEmoji.shiny) {
            dispatch(addShinyEmojiTapped());
        }
    })

    incrementTapBoost();
    calculateEpt();

    // Every 500th tap earns a gem
    const tapGem = checkTapGem(state.stats.bigEmojiTaps + 1);

    return { shinyReward: bigEmoji.shiny ? shinyReward : undefined, tapGem };
}

/** Every emoji that can be on the Big Emoji and hasn't been found yet */
function undiscoveredEmojis() {
    const collection = store.getState().collection;
    const found: { emoji: string, index: number, category: string }[] = [];
    (Object.keys(emojiData) as (keyof typeof emojiData)[]).forEach(category => {
        const owned = collection[category] ?? [];
        emojiData[category].forEach((emoji, index) => {
            if (!isCollectible(category, index)) return;
            if ((owned[index]?.amount ?? 0) > 0) return;
            found.push({ emoji, index, category });
        });
    });
    return found;
}

export const hasUndiscoveredEmojis = () => undiscoveredEmojis().length > 0;

interface EmojiWeights {
    [key: string]: number;
}

const emojiWeights: EmojiWeights = {
    faces: 30,
    symbols: 3,
    people: 8,
    animals: 20,
    food: 20,
    bodyParts: 10,
    objects: 15,
    placesBuildings: 10,
    plants: 10,
    vehicles: 10,
    weather: 10
};

const emojiData = {
    faces,
    symbols,
    people,
    animals,
    food,
    bodyParts,
    objects,
    placesBuildings,
    plants,
    vehicles,
    weather
};

/**
 * Picks the emoji that replaces the Big Emoji on the next tap, and whether it's shiny
 */
export function pickNextEmoji() {
    let randomEmoji = selectRandomEmoji();
    // Discoveries (gems): one never found before, while there are any left
    if ((store.getState().gems.discoveries ?? 0) > 0) {
        const undiscovered = undiscoveredEmojis();
        if (undiscovered.length > 0) {
            randomEmoji = undiscovered[Math.floor(Math.random() * undiscovered.length)];
            store.dispatch(addDiscoveries(-1));
        } else {
            store.dispatch(addDiscoveries(-(store.getState().gems.discoveries ?? 0)));
        }
    }
    // Fun value 91 - 98 (collector): shiny emojis are 1.25× as likely
    const shinyChance = SHINY_CHANCE * (howFun(91, 98) ? 1.25 : 1) * shinyChanceMultiplier();
    // None in the first stretch of the game, so the first one comes once there's more going on
    const shiniesUnlocked = store.getState().stats.emojisGained >= SHINY_FROM_EMOJIS_PRODUCED;
    const shiny = alwaysShiny || (shiniesUnlocked && Math.random() < shinyChance);
    store.dispatch(updateNextEmoji({
        emoji: randomEmoji.emoji,
        category: randomEmoji.category,
        id: randomEmoji.index,
        shiny,
    }))
    return randomEmoji.emoji
}


/**
 * Selects a "random" emoji based on weighted probabilities for each emoji type
 *
 * The function calculates the total weight based on the weights assigned to different emoji categories. 
 * It then generates a random number and selects an emoji category based on the weighted probabilities. 
 * After selecting a category, it picks a random emoji from that category and returns it
 *
 */
export function selectRandomEmoji() {
    const emojiCategories = Object.keys(emojiWeights);

    // Calculate the total weight
    const totalWeight = emojiCategories.reduce((total, category) => total + emojiWeights[category], 0);

    // Generate a random number up to the total weight
    let randomNum = Math.random() * totalWeight;

    // Find the emoji type corresponding to the random number
    for (const category of emojiCategories) {
        // Check if the random number falls within the current category's weight
        if (randomNum < emojiWeights[category]) return randomCollectible(category);
        randomNum -= emojiWeights[category];  // Decrease randomNum by the current weight
    }

    // Fallback: Pick a completely random emoji from any category
    return randomCollectible(emojiCategories[Math.floor(Math.random() * emojiCategories.length)]);
}

// Indexes of the emojis in each category that can be on the Big Emoji (see isCollectible), worked out once
const collectibleIndexes: Record<string, number[]> = {};

/** A random emoji from a category, one that's collectible on this device */
function randomCollectible(category: string) {
    const allEmojis = emojiData[category as keyof typeof emojiData];
    collectibleIndexes[category] ??= allEmojis.map((_, index) => index).filter(index => isCollectible(category, index));
    const indexes = collectibleIndexes[category];
    const index = indexes[Math.floor(Math.random() * indexes.length)];
    // The index is into the full category list, which is what the collection is keyed by
    return { emoji: allEmojis[index], index, category };
}
