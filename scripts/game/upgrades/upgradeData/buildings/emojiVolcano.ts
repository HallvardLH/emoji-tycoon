import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseEmojiVolcanoUpgrade = {
    building: "Emoji volcano" as BuildingNames,
    buildingId: 12,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const emojiVolcanoUpgrades: UpgradeType[] = [
    {
        ...baseEmojiVolcanoUpgrade,
        name: "Heat-resistant gloves",
        icon: "🧤",
        description: "For safely handling emojis fresh out of the magma.",
        tier: 0,
        id: 1300,
    },
    {
        ...baseEmojiVolcanoUpgrade,
        name: "Obsidian molds",
        icon: "🪨",
        description: "Pour molten emojis into perfectly smiley shapes.",
        tier: 1,
        id: 1301,
    },
    {
        ...baseEmojiVolcanoUpgrade,
        name: "Volcanologists",
        icon: "🧑‍🔬",
        description: "They study the volcano. The volcano studies them back.",
        tier: 2,
        id: 1302,
    },
    {
        ...baseEmojiVolcanoUpgrade,
        name: "Geothermal power",
        icon: "♨️",
        description: "Hot springs make for hot emojis.",
        quote: "Hot hot hot!",
        tier: 3,
        id: 1303,
    },
    {
        ...baseEmojiVolcanoUpgrade,
        name: "Supervolcano",
        icon: "🔥",
        description: "Every eruption now covers a continent in fresh emojis. Nobody complains.",
        tier: 4,
        id: 1304,
    },
];
