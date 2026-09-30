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
import { effectEmojis } from './effects/effectData';
import { incrementTapBoost, getComboProgress } from './tapBoost';
import { calculateEpt } from './calculations';
import { howFun } from './shorthands';

/** Chance that a new Big Emoji is shiny */
export const SHINY_CHANCE = 1 / 200;
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
 * What tapping a shiny emoji is worth: 50 taps, or a minute of production if that's more
 */
function getShinyReward(emojisPerTap: number, emojisPerSecond: number) {
    return Math.max(emojisPerTap * 50, emojisPerSecond * 60);
}

/**
 * Taps the Big Emoji, which then becomes the next emoji
 *
 * @returns the bonus given if the tapped emoji was shiny
 */
export function tapEmoji(): number | undefined {
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

    return bigEmoji.shiny ? shinyReward : undefined;
}

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
    // Fun value 91 - 98 (collector): shiny emojis are 1.25× as likely
    const shinyChance = SHINY_CHANCE * (howFun(91, 98) ? 1.25 : 1);
    const shiny = alwaysShiny || Math.random() < shinyChance;
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
        if (randomNum < emojiWeights[category]) {
            const allEmojis = emojiData[category as keyof typeof emojiData];
            // Filter out effect emojis, as these are to be reserved
            const emojis = allEmojis.filter(emoji => !effectEmojis.includes(emoji));
            // Randomly select an emoji from the chosen category
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            // The index is into the full category list, which is what the collection is keyed by
            return { emoji: emoji, index: allEmojis.indexOf(emoji), category: category };
        }
        randomNum -= emojiWeights[category];  // Decrease randomNum by the current weight
    }

    // Fallback: Pick a completely random emoji from any category
    const randomCategory = emojiCategories[Math.floor(Math.random() * emojiCategories.length)];
    const randomEmojis = emojiData[randomCategory as keyof typeof emojiData];
    const randomEmojiIndex = Math.floor(Math.random() * randomEmojis.length);

    return { emoji: randomEmojis[randomEmojiIndex], index: randomEmojiIndex, category: randomCategory };
}
