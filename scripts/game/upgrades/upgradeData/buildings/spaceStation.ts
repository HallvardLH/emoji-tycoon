import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseSpaceStationUpgrade = {
    building: "Space station" as BuildingNames,
    buildingId: 10,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const spaceStationUpgrades: UpgradeType[] = [
    {
        ...baseSpaceStationUpgrade,
        name: "Telescopes",
        icon: "🔭",
        description: "Look into the stars to discover emoji planets.",
        tier: 0,
        id: 80,
    },
    {
        ...baseSpaceStationUpgrade,
        name: "Satellite antennas",
        icon: "📡",
        description: "Look beyond the Milky Way toward the Emojiway galaxy.",
        tier: 1,
        id: 81,
    },
    {
        ...baseSpaceStationUpgrade,
        name: "Astronauts",
        icon: "👩‍🚀",
        description: "Someone needs to run your space stations.",
        tier: 2,
        id: 82,
    },
    {
        ...baseSpaceStationUpgrade,
        name: "Rockets",
        icon: "🚀",
        description: "Flies really fast.",
        tier: 3,
        id: 83,
    },
    {
        ...baseSpaceStationUpgrade,
        name: "⍙⟒ ☊⍜⋔⟒ ⟟⋏ ⌿⟒⏃☊⟒...",
        icon: "👽",
        description: "...⏃⋏⎅ ⍙⟒ ⏚⍀⟟⋏☌ ☊⍀⏃⋉⊬ ⋏⟒⍙ ⟒⋔⍜⟊⟟⌇.",
        quote: "⏁⏃⌿ ⋔⊬ ⎎⏃☊⟒ ⍾⎍⟟⋏⏁⟟☊⟒ ⏁⍜ ⎍⋏⌰⍜☊☍ ⋔⊬ ⌇⟒☊⍀⟒⏁",
        tier: 4,
        id: 84,
    },
    {
        ...baseSpaceStationUpgrade,
        name: "⌇⏁⍀⏃⋏☌⟒ ⍜⏚⟊⟒☊⏁",
        icon: "🧸",
        description: "⏁⊑⟟⌇ ⍜⏚⟊⟒☊⏁ ⊑⍜⌰⎅⌇ ⎍⋏⏁⍜⌰⎅ ⌿⍜⍙⟒⍀⌇.",
        tier: 5,
        id: 1199,
    },
];
