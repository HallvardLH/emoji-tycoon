// How many of a building you need for each standard upgrade tier. Tuned with the
// balance sim to counts players actually reach: around 100 - 150 of the early
// buildings and 40 - 80 of the late ones by the time the singularity arrives.
const TIER_REQUIREMENTS = [1, 5, 10, 20, 30, 40, 50, 60, 75, 90, 100, 125, 150];

/**
 * Returns the amount of a building required to unlock a standard upgrade of the given tier
 *
 * 1, 5, 10, 20, 30 ... 150 for tiers 0 - 12, then 25 more per tier (175, 200...)
 */
export function getBuildingUnlockRequirement(tier: number) {
    if (tier < TIER_REQUIREMENTS.length) {
        return TIER_REQUIREMENTS[tier];
    }
    return TIER_REQUIREMENTS[TIER_REQUIREMENTS.length - 1] + (tier - TIER_REQUIREMENTS.length + 1) * 25;
}
