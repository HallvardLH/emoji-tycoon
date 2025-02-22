import store from "../../redux/reduxStore";
import { updateRemainingEmojisPrestigePerc } from "../../redux/prestigeSlice";
import { formatNumber } from "../../misc";

export function getPrestigeLevel() {
    const emojisGained = store.getState().stats.emojisGained;
    return Math.floor(Math.sqrt(emojisGained / 1e10));
}

export function emojisForNextPrestigeLevel() {
    const currentPrestigeLevel = getPrestigeLevel();
    // Calculate the emojis required for the next level
    const nextPrestigeLevel = currentPrestigeLevel + 1;
    return Math.pow(nextPrestigeLevel, 2) * 1e10;
}

export function calculateRemainingEmojisForNextPrestige(asPercentage = false) {
    const emojisGained = store.getState().stats.emojisGained;
    const emojisNeededForNextLevel = emojisForNextPrestigeLevel();
    const currentLevelRequiredEmojis = Math.pow(getPrestigeLevel(), 2) * 1e10;

    // console.log(formatNumber(currentLevelRequiredEmojis), getPrestigeLevel())

    // Calculate remaining emojis to reach next level
    const remaining = emojisNeededForNextLevel - emojisGained;

    if (asPercentage) {
        // Calculate the percentage progress towards the next level
        const totalForNextLevel = emojisNeededForNextLevel - currentLevelRequiredEmojis;
        const progress = ((emojisGained - currentLevelRequiredEmojis) / totalForNextLevel) * 100;

        store.dispatch(updateRemainingEmojisPrestigePerc(progress));
        // console.log(progress)
        return progress

    }

    return remaining
}
