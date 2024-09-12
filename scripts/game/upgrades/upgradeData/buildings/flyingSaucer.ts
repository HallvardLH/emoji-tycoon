import { UpgradeType, getBuildingUpgradePrice, UnlockConditionType, UpgradeCateogoriesType, UpgradeVariantsType } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";

// Base object for Flying Saucer upgrades
const baseFlyingSaucerUpgrade = {
    building: "Flying saucer" as BuildingNames,
    buildingId: 9,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const flyingSaucerUpgrades: UpgradeType[] = [
    // Flying Saucer upgrades
    {
        ...baseFlyingSaucerUpgrade,
        name: "Telescopes",
        icon: "🔭",
        description: "Look into the stars to discover prospective planets.",
        price: getBuildingUpgradePrice(0, 8),
        tier: 0,
        id: 80,
    },
    {
        ...baseFlyingSaucerUpgrade,
        name: "Satellite antennas",
        icon: "📡",
        description: "Look beyond the Milky Way toward the Emojiway galaxy.",
        price: getBuildingUpgradePrice(1, 8),
        tier: 1,
        id: 81,
    },
    {
        ...baseFlyingSaucerUpgrade,
        name: "Astronauts",
        icon: "👩‍🚀",
        description: "Pilots the flying saucers to distant planets.",
        price: getBuildingUpgradePrice(2, 8),
        tier: 2,
        id: 82,
    },
    {
        ...baseFlyingSaucerUpgrade,
        name: "Rockets",
        icon: "🚀",
        description: "Flies really fast.",
        price: getBuildingUpgradePrice(3, 8),
        tier: 3,
        id: 83,
    },
    {
        ...baseFlyingSaucerUpgrade,
        name: "⍙⟒ ☊⍜⋔⟒ ⟟⋏ ⌿⟒⏃☊⟒...",
        icon: "👽",
        description: "...⏃⋏⎅ ⍙⟒ ⏚⍀⟟⋏☌ ☊⍀⏃⋉⊬ ⋏⟒⍙ ⟒⋔⍜⟊⟟⌇.",
        price: getBuildingUpgradePrice(4, 8),
        tier: 4,
        id: 84,
    },
];
