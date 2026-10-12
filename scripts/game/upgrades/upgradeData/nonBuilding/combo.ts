import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";
import { BIG_EMOJI_BUILDING_ID } from "./bigEmoji";

/**
 * Combo level upgrades. There is no combo at the start (a combo from the first tap made
 * tapping far too strong early on): the first of these, Combo!, turns it on up to ×3,
 * and each one after raises the max by one, up to ×8. Each needs the one before it.
 *
 * They unlock by "combo taps": every tap counts the combo multiplier it was made at,
 * so a tap at ×3 counts 3, and before the combo is on every tap counts 1. With the
 * combo's rising drain, reaching ×N takes roughly N + 0.5 taps per second, so the top
 * levels are also a test of tapping speed.
 *
 * Pacing, for an active player:
 * - The combo itself a few minutes in, after a couple of hundred taps
 * - ×4 in the first ~10 minutes
 * - ×5 around an hour in
 * - ×6 a few hours in
 * - ×7 and ×8 long-term goals, priced alongside the late buildings
 */
// By tier: Combo! (tier 0), then ×4 up to ×8
export const COMBO_LEVEL_UNLOCK_TAPS = [200, 1_000, 6_000, 25_000, 80_000, 250_000];
export const COMBO_LEVEL_PRICES = [10_000, 25_000, 5_000_000, 1_000_000_000, 1_000_000_000_000, 1_000_000_000_000_000];

// The max combo Combo! gives
export const BASE_MAX_COMBO = 3;

/** The max combo a combo level upgrade of this tier gives */
export const comboLevelOfTier = (tier: number) => BASE_MAX_COMBO + tier;

// Combo level upgrades get ids from 9900 in the order listed below, clear of every building's range
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

// Ids come from the order here, and saves store ids: Combo! came later, so it's last
export const comboUpgrades: UpgradeType[] = [
    {
        ...baseComboUpgrade,
        name: "Warm-up",
        icon: "🔥",
        description: "Your fingers are loosening up. The combo can now reach ×4.",
        quote: "My finger hurts so bad I can hardly believe it.",
        tier: 1,
    },
    {
        ...baseComboUpgrade,
        name: "Hot streak",
        icon: "⚡",
        description: "Tapping at the speed of lightning. The combo can now reach ×5.",
        quote: "Is it hot in here, or is it just my screen?",
        tier: 2,
    },
    {
        ...baseComboUpgrade,
        name: "On fire",
        icon: "💥",
        description: "Legends speak of a tapper so fast the screen caught fire. The combo can now reach ×6.",
        tier: 3,
    },
    {
        ...baseComboUpgrade,
        name: "Inferno",
        icon: "🌋",
        description: "Your thumbs have become a natural disaster. The combo can now reach ×7.",
        quote: "The screen protector has left the chat.",
        tier: 4,
    },
    {
        ...baseComboUpgrade,
        name: "Supernova",
        icon: "🌟",
        description: "You tap so fast that light itself struggles to keep up. The combo can now reach ×8.",
        tier: 5,
    },
    {
        ...baseComboUpgrade,
        name: "Combo!",
        icon: "🥁",
        description: "Tap fast to build a combo that multiplies every tap, up to ×3. Keep the rhythm going!",
        tier: 0,
    },
];
