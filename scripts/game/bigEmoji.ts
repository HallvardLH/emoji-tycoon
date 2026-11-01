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
import { CELEBRATED_RARITY, Rarity, isAtLeast, pickRandomEmoji, pickWeighted, rarityOf } from './collection/rarity';
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
export function tapEmoji(): { shinyReward?: number, tapGem: boolean, newFind?: { emoji: string, rarity: Rarity } } {
    const state = store.getState();
    const { emojis, emojisPerSecond } = state.values;
    const { emojisPerTap, bigEmoji, nextEmoji } = state.bigEmoji;

    const shinyReward = bigEmoji.shiny ? getShinyReward(emojisPerTap, emojisPerSecond) : 0;
    // A first find of a rare emoji or better is celebrated
    const firstFind = (state.collection[bigEmoji.category as keyof CollectionState]?.[bigEmoji.id]?.amount ?? 0) === 0;
    const rarity = rarityOf(bigEmoji.category, bigEmoji.id);
    const newFind = firstFind && isAtLeast(rarity, CELEBRATED_RARITY) ? { emoji: bigEmoji.emoji, rarity } : undefined;
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

    // Every TAP_GEM_EVERY-th tap earns a gem
    const tapGem = checkTapGem(state.stats.bigEmojiTaps + 1);

    return { shinyReward: bigEmoji.shiny ? shinyReward : undefined, tapGem, newFind };
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
        // Still by rarity, so gems find the rare ones sooner but don't hand out every legendary
        const undiscovered = pickWeighted(undiscoveredEmojis());
        if (undiscovered) {
            randomEmoji = undiscovered;
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
 * A random emoji for the Big Emoji (and the emoji rains), by rarity and category:
 * common ones turn up often, legendary ones hardly ever (see rarity.ts)
 */
export function selectRandomEmoji() {
    return pickRandomEmoji();
}
