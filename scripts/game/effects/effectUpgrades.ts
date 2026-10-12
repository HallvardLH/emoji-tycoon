import store from "../../redux/reduxStore";
import { getUpgradeDataById } from "../upgrades/shorthands";
import { isEffectEmojiUpgradeId } from "../upgrades/upgradeData/nonBuilding/effectEmojis";

/** The effect emoji upgrades owned (see effectEmojis.ts) */
const ownedEffectEmojiUpgrades = () => store.getState().upgrades.owned
    .filter(isEffectEmojiUpgradeId)
    .map(getUpgradeDataById)
    .filter(Boolean);

/** Whether effect emojis appear at all: Good vibes (or any effect emoji upgrade) is owned */
export const hasEffectEmojis = () => store.getState().upgrades.owned.some(isEffectEmojiUpgradeId);

/** How much more often effect emojis appear, from the upgrades owned */
export const effectUpgradeSpawnMultiplier = () => ownedEffectEmojiUpgrades()
    .reduce((mult, upgrade) => mult * (upgrade.effectSpawnRateMultiplier ?? 1), 1);

/** How much longer good effects last, from the upgrades owned */
export const effectUpgradeDurationMultiplier = () => ownedEffectEmojiUpgrades()
    .reduce((mult, upgrade) => mult * (upgrade.effectDurationMultiplier ?? 1), 1);
