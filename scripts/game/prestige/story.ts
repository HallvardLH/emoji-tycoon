import store from "../../redux/reduxStore";
import { buildingIdOf } from "../buildings/buildingData";

/**
 * The story, told without words. Something has been watching the Big Emoji since the
 * first tap: the First Emoji, a wobbly face drawn by a beginner. Signs of it build up
 * across the game, each one subtle on its own:
 *
 * 1. Watching: now and then a pair of 👀 falls with the emoji rain (from your first Bank)
 * 2. Blinking: the Big Emoji blinks, every minute or so (from your first Temple of the Big Emoji in the sky)
 * 3. Stars: each prestige adds a star to the sky behind the Big Emoji. They look scattered at first
 * 4. The face: a faint, wobbly face shows through the sky, and the stars turn out to be on its lines
 *    (from the 4th prestige, or your first Emoji black hole)
 * 5. Its gaze: the face looks at the Big Emoji whenever you tap it (from your first The first emoji, or the 8th prestige)
 * 6. Complete: the last star finishes its smile, and the Big Emoji winks instead of blinking
 *
 * Signs tied to buildings show up in any run where they're owned, and stay for good once
 * enough prestiges have passed. The ascension shows the sky with each new star.
 */

/** Where the stars sit, in a 100 × 100 box around the face, in the order prestiges add them.
 *  The head's outline first (they look scattered), then the eyes, and the smile last */
export const STARS: { x: number, y: number }[] = [
    { x: 9, y: 34 },
    { x: 91, y: 62 },
    { x: 50, y: 4 },
    { x: 18, y: 80 },
    { x: 84, y: 20 },
    { x: 36, y: 24 },
    { x: 64, y: 24 },
    { x: 32, y: 72 },
    { x: 68, y: 72 },
    { x: 42, y: 79 },
    { x: 58, y: 79 },
];

export const MAX_STARS = STARS.length;

const prestiges = () => store.getState().prestige.prestiges ?? 0;

function owns(building: string) {
    return (store.getState().buildings.buildings[buildingIdOf(building)]?.amount ?? 0) > 0;
}

/** Stars in the sky: one per prestige */
export const starCount = () => Math.min(MAX_STARS, prestiges());

export const isWatching = () => prestiges() >= 1 || owns("Bank");

export const isBlinking = () => prestiges() >= 2 || owns("Temple of the Big Emoji in the sky");

export const showsFace = () => prestiges() >= 4 || owns("Emoji black hole");

export const followsTaps = () => prestiges() >= 8 || owns("The first emoji");

export const isStoryComplete = () => prestiges() >= MAX_STARS;

/** Chance a drop in the emoji rain is a pair of eyes: rare, a little less rare as the story goes on */
export function watchingChance() {
    if (!isWatching()) return 0;
    return 0.015 + Math.min(prestiges(), 6) * 0.004;
}

// Taps on the Big Emoji, for the face's gaze
const tapListeners = new Set<() => void>();

export function onBigEmojiTap(listener: () => void) {
    tapListeners.add(listener);
    return () => { tapListeners.delete(listener); };
}

export function notifyBigEmojiTap() {
    tapListeners.forEach(listener => listener());
}
