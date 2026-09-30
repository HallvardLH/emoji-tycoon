import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseEmojiSingularityUpgrade = {
    building: "Emoji singularity" as BuildingNames,
    buildingId: 16,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiSingularityUpgrades: UpgradeType[] = [
    {
        ...baseEmojiSingularityUpgrade,
        name: "Infinite density",
        icon: "⚫",
        description: "Every emoji ever made, compressed into a single point.",
        tier: 0,
        id: 1700,
    },
    {
        ...baseEmojiSingularityUpgrade,
        name: "Time dilation",
        icon: "⏳",
        description: "Emojis now arrive before you've even drawn them.",
        tier: 1,
        id: 1701,
    },
    {
        ...baseEmojiSingularityUpgrade,
        name: "Multiverse merger",
        icon: "♾️",
        description: "All realities have been combined into one. They were all emojis anyway.",
        tier: 2,
        id: 1702,
    },
    {
        ...baseEmojiSingularityUpgrade,
        name: "Emoji enlightenment",
        icon: "🫥",
        description: "You are no longer sure where you end and the emojis begin.",
        tier: 3,
        id: 1703,
    },
    {
        ...baseEmojiSingularityUpgrade,
        name: "The final emoji",
        icon: "🙂",
        description: "At the end of everything, a single emoji remains. It looks a lot like the first one you ever tapped.",
        quote: "Tap to begin again?",
        tier: 4,
        id: 1704,
    },
];
