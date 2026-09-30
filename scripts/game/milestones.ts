import store from "../redux/reduxStore";
import { setBankMilestone } from "../redux/statsSlice";
import { formatNumber } from "../misc";

export interface Milestone {
    icon: string;
    /** Small caps line, e.g. "MILESTONE" */
    caption: string;
    title: string;
}

type Listener = (milestone: Milestone) => void;
const listeners = new Set<Listener>();

/** Subscribe to milestones as they happen. Returns an unsubscribe function. */
export function onMilestone(listener: Listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function celebrateMilestone(milestone: Milestone) {
    listeners.forEach(listener => listener(milestone));
}

// Emojis-drawn milestones, one per power of 1000
const bankIcons = ["🎈", "🎉", "🏆", "💎", "👑", "🚀", "🌌"];

/**
 * Celebrates each time the emojis drawn in total passes a new power of 1000
 * (a thousand, a million, a billion...). Uses the all-time total, so spending
 * emojis never retriggers one.
 *
 * Called every second from the gameLoop
 */
export function checkBankMilestone() {
    const { emojisGained, bankMilestone } = store.getState().stats;
    const reached = emojisGained >= 1000 ? Math.floor(Math.log10(emojisGained) / 3) : 0;

    // Saves from before milestones existed start from where they are, without a flood of old milestones
    if (bankMilestone === undefined) {
        store.dispatch(setBankMilestone(reached));
        return;
    }

    if (reached > bankMilestone) {
        store.dispatch(setBankMilestone(reached));
        celebrateMilestone({
            icon: bankIcons[Math.min(reached - 1, bankIcons.length - 1)],
            caption: "MILESTONE",
            title: `${formatNumber(Math.pow(1000, reached), 0)} emojis drawn!`,
        });
    }
}
