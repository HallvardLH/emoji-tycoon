import { AppState, Platform } from "react-native";
import store from "../redux/reduxStore";
import { setOfflineOffer } from "../redux/offlineSlice";
import { calculateBaseEmojisPerSecond } from "./calculations";
import { giveEmojis } from "./gameLoop";
import { giveOneOffEmojis } from "./giveEmojis";
import { creditBuildings } from "./buildings/buildingTotals";

/**
 * Offline production
 *
 * Nothing is produced while the game is away (closed, in the background or in a
 * hidden tab). Coming back after more than a minute offers the time away as
 * emojis: 100% of production for watching an ad, 200% for gems.
 * Shorter breaks count as playing and pay full production.
 */

/** Breaks up to this long count as playing */
export const AWAY_THRESHOLD_SECONDS = 60;
/** Time away past this isn't paid for */
export const MAX_AWAY_SECONDS = 8 * 3600;
/** Share of production paid for each way of claiming */
export const AD_MULTIPLIER = 1;
export const GEM_MULTIPLIER = 2;
export const GEM_COST = 10;

/** Whether the game is out of sight right now. It produces nothing then */
export function isGameHidden() {
    if (Platform.OS === "web") {
        return typeof document !== "undefined" && document.visibilityState === "hidden";
    }
    return AppState.currentState !== "active";
}

/**
 * Called when the player comes back
 *
 * Short breaks pay full production. Longer ones add to the offer of offline
 * earnings, which waits until it's claimed or dismissed.
 */
export function registerAway(seconds: number) {
    if (seconds <= 0) return;
    if (seconds <= AWAY_THRESHOLD_SECONDS) {
        giveEmojis(seconds);
        return;
    }

    // Nothing to offer before there's any production (a new game, or right after a prestige)
    const eps = calculateBaseEmojisPerSecond();
    if (!(eps > 0)) return;

    const previous = store.getState().offline.offer?.seconds ?? 0;
    store.dispatch(setOfflineOffer({
        seconds: Math.min(previous + seconds, MAX_AWAY_SECONDS),
        eps,
    }));
}

/** What the offer is worth at a multiplier */
export function offlineEarnings(multiplier: number) {
    const offer = store.getState().offline.offer;
    if (!offer) return 0;
    return offer.eps * offer.seconds * multiplier;
}

/**
 * Pays out the offer and clears it
 *
 * @returns the emojis given
 */
export function claimOffline(multiplier: number) {
    const earned = offlineEarnings(multiplier);
    store.dispatch(setOfflineOffer(undefined));
    giveOneOffEmojis(earned);
    // The buildings made it while you were away (the ad or gem bonus counts as a buff)
    creditBuildings(earned);
    return earned;
}

export function dismissOffline() {
    store.dispatch(setOfflineOffer(undefined));
}
