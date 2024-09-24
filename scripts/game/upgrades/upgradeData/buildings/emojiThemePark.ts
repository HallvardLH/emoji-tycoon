import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

// Base object for Emoji Theme Park upgrades
const baseEmojiThemeParkUpgrade = {
    building: "Emoji theme park" as BuildingNames,
    buildingId: 8,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiThemeParkUpgrades: UpgradeType[] = [
    // Emoji Theme Park upgrades
    {
        ...baseEmojiThemeParkUpgrade,
        name: "Merry-go-rounds",
        icon: "🎠",
        description: "You spin me right 'round, baby!",
        price: getBuildingUpgradePrice(0, 6),
        tier: 0,
        id: 60,
    },
    {
        ...baseEmojiThemeParkUpgrade,
        name: "Slides",
        icon: "🛝",
        description: "Do you slide on all your nights like this? (I might)",
        price: getBuildingUpgradePrice(1, 6),
        tier: 1,
        id: 61,
    },
    {
        ...baseEmojiThemeParkUpgrade,
        name: "Ferris wheel",
        icon: "🎡",
        description: "Way up, there is where she broke my heart.",
        price: getBuildingUpgradePrice(2, 6),
        tier: 2,
        id: 62,
    },
    {
        ...baseEmojiThemeParkUpgrade,
        name: "Circus",
        icon: "🎪",
        description: "There's only two types of people in the world. The ones that entertain, and the ones that observe.",
        price: getBuildingUpgradePrice(3, 6),
        tier: 3,
        id: 63,
    },
    {
        ...baseEmojiThemeParkUpgrade,
        name: "Emoji juggler",
        icon: "🤹‍♂️",
        description: "They say he's never dropped the ball.",
        price: getBuildingUpgradePrice(4, 6),
        tier: 4,
        id: 64,
    },
];
