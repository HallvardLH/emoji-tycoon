import store from "../redux/reduxStore";
import { addEffectEmojisCollected, addShinyEmojiTapped, setComboTaps, addEmojisEarnedFromTap } from "../redux/statsSlice";
import { addToCollection, CollectionState } from "../redux/collectionSlice";
import { selectRandomEmoji } from "./bigEmoji";
import { unlockUpgrades } from "./upgrades/checks";

/**
 * Cheats for stats that take a long time to build up by playing,
 * so the things they gate can be tested
 */

/** Combo taps unlock the combo level upgrades */
export function cheatAddComboTaps(amount: number) {
    const { comboTaps = 0 } = store.getState().stats;
    store.dispatch(setComboTaps(comboTaps + amount));
    unlockUpgrades();
}

/** Emojis earned from tapping unlock the Big Emoji "hands" upgrades (up to 10^26) */
export function cheatMultiplyTapEarnings(factor: number) {
    const { emojisEarnedFromTap } = store.getState().stats;
    const target = Math.max(1000, emojisEarnedFromTap * factor);
    store.dispatch(addEmojisEarnedFromTap(target - emojisEarnedFromTap));
    unlockUpgrades();
}

/** Adds random emojis to the collection, as if tapped; `shinyEvery` makes every nth one shiny */
export function cheatCollectEmojis(amount: number, shinyEvery = 0) {
    for (let i = 0; i < amount; i++) {
        const { emoji, category, index } = selectRandomEmoji();
        const shiny = shinyEvery > 0 && i % shinyEvery === 0;
        if (index < 0 || !emoji) continue;
        store.dispatch(addToCollection({ category: category as keyof CollectionState, id: index, shiny }));
        if (shiny) store.dispatch(addShinyEmojiTapped());
    }
}

/** Magical (effect) emojis tapped, only shown in Stats */
export function cheatAddMagicalEmojis(amount: number) {
    store.dispatch(addEffectEmojisCollected(amount));
}
