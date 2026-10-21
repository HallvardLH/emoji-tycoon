import { useSyncExternalStore } from "react";

/**
 * Debug speed: runs the economy faster for testing progression and prestige.
 *
 * Production and the run's play time (Momentum, essence per hour) speed up.
 * Effects, effect spawns and the combo stay on real time so the game stays
 * playable. Not saved, so a reload is back to normal speed.
 */
export const DEBUG_SPEED = 1000;

let speed = 1;
const listeners = new Set<() => void>();

export function getGameSpeed() {
    return speed;
}

export function setGameSpeed(next: number) {
    speed = next;
    listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

/** The game speed, re-rendering when it changes */
export function useGameSpeed() {
    return useSyncExternalStore(subscribe, getGameSpeed);
}
