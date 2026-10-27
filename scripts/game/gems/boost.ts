import store from "../../redux/reduxStore";

/**
 * Timed gem buys: the gem boost and the combo keeper
 *
 * Both run on the clock (a timestamp), not on game ticks, so they keep running while
 * the game is closed: a boost bought before bed still counts for the offline earnings.
 * Kept apart from gemShop.ts, as the production calculations read them.
 */

/** Production and taps while the gem boost is on */
export const BOOST_MULTIPLIER = 2;

export const boostSecondsLeft = (now = Date.now()) =>
    Math.max(0, ((store.getState().gems.boostUntil ?? 0) - now) / 1000);

export const isBoostActive = (now = Date.now()) => boostSecondsLeft(now) > 0;

export const boostMultiplier = () => isBoostActive() ? BOOST_MULTIPLIER : 1;

/**
 * Seconds of a stretch of time that the boost was on for
 *
 * @param from start of the stretch, in ms
 * @param to end of the stretch, in ms
 */
export function boostedSecondsBetween(from: number, to: number) {
    const until = store.getState().gems.boostUntil ?? 0;
    return Math.max(0, (Math.min(to, until) - from) / 1000);
}

export const comboKeeperSecondsLeft = (now = Date.now()) =>
    Math.max(0, ((store.getState().gems.comboKeeperUntil ?? 0) - now) / 1000);

/** Whether the combo keeper is holding the combo where it is */
export const isComboKept = () => comboKeeperSecondsLeft() > 0;

/** "29:59", or "1:05:00" past an hour */
export function formatCountdown(seconds: number) {
    const total = Math.ceil(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
