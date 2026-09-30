import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";
import { BIG_EMOJI_BUILDING_ID } from "./bigEmoji";

/**
 * Combo level upgrades: the max combo starts at ×3 and each of these raises it by one, up to ×8.
 *
 * They unlock by "combo taps": every tap counts the combo multiplier it was made at,
 * so a tap at ×3 counts 3. With the combo's rising drain, reaching ×N takes roughly
 * N + 0.5 taps per second, so the top levels are also a test of tapping speed.
 *
 * Pacing, for an active player:
 * - ×4 in the first ~10 minutes
 * - ×5 around an hour in
 * - ×6 a few hours in
 * - ×7 and ×8 long-term goals, priced alongside the late buildings
 */
export const COMBO_LEVEL_UNLOCK_TAPS = [1_000, 6_000, 25_000, 80_000, 250_000];
export const COMBO_LEVEL_PRICES = [25_000, 5_000_000, 1_000_000_000, 1_000_000_000_000, 1_000_000_000_000_000];

// The combo before any combo level upgrade
export const BASE_MAX_COMBO = 3;

/** The max combo a combo level upgrade of this tier gives */
export const comboLevelOfTier = (tier: number) => BASE_MAX_COMBO + tier + 1;

// Combo level upgrades get ids 9900 + tier, clear of every building's range
export const COMBO_UPGRADE_ID_BLOCK = 99;
const FIRST_COMBO_UPGRADE_ID = COMBO_UPGRADE_ID_BLOCK * 100;
export const isComboUpgradeId = (id: number) => id >= FIRST_COMBO_UPGRADE_ID && id < FIRST_COMBO_UPGRADE_ID + 100;

const baseComboUpgrade = {
    building: "Big emoji" as BuildingNames,
    buildingId: BIG_EMOJI_BUILDING_ID,
    unlockCondition: "Combo taps" as UnlockConditionType,
    categories: ["Combo level" as UpgradeCateogoriesType],
    variant: "Combo level" as UpgradeVariantsType,
};

export const comboUpgrades: UpgradeType[] = [
    {
        ...baseComboUpgrade,
        name: "Warm-up",
        icon: "🔥",
        description: "Your fingers are loosening up. The combo can now reach ×4.",
        tier: 0,
    },
    {
        ...baseComboUpgrade,
        name: "Hot streak",
        icon: "⚡",
        description: "Tapping at the speed of lightning. The combo can now reach ×5.",
        quote: "Is it hot in here, or is it just my screen?",
        tier: 1,
    },
    {
        ...baseComboUpgrade,
        name: "On fire",
        icon: "💥",
        description: "Legends speak of a tapper so fast the screen caught fire. The combo can now reach ×6.",
        tier: 2,
    },
    {
        ...baseComboUpgrade,
        name: "Inferno",
        icon: "🌋",
        description: "Your thumbs have become a natural disaster. The combo can now reach ×7.",
        quote: "The screen protector has left the chat.",
        tier: 3,
    },
    {
        ...baseComboUpgrade,
        name: "Supernova",
        icon: "🌟",
        description: "You tap so fast that light itself struggles to keep up. The combo can now reach ×8.",
        tier: 4,
    },
];
