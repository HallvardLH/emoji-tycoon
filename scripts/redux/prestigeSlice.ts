import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PrestigeState {
    /** Unspent emoji essence. Each one boosts production (see prestige.ts), and it's spent on perks */
    emojiEssence: number,
    /** All essence ever earned by prestiging, spent or not. New essence is what the all-time total is worth beyond this */
    totalEssenceEarned: number,
    /** How many times the player has prestiged; each one unlocks the next tier of perks */
    prestiges: number,
    /** Ids of the perks bought */
    perks: string[],
    /** All-time emojis drawn when the current run started */
    runStartEmojis: number,
    /** Highest production this run (without effects), and in the run before; Head start (perk) uses it */
    runPeakEps?: number,
    lastRunPeakEps?: number,
    /** When the game was last running, for offline earnings */
    lastSeen?: number,
    /** Progress towards the next essence, 0 - 100 */
    remainingEmojisPrestigePerc: number;
    /** Saves without it are from before prestige worked, and get migrated */
    version?: number,
    /** Seconds played this run (not counting time away). Undefined in saves from before it existed */
    runSeconds?: number,
    /** Best essence per hour this run, to tell when it starts slowing down */
    runBestEssenceRate?: number,
    /** The last runs, newest first */
    history?: PastRun[],
    /** The trial this run is played under, if any (see trials.ts) */
    activeTrial?: ActiveTrial,
    /** Ids of the trials completed */
    trialsCompleted?: string[],
}

export interface PastRun {
    essence: number,
    seconds: number,
    /** Emojis drawn during the run */
    emojis: number,
    /** Trial played, if any */
    trial?: string,
    trialCompleted?: boolean,
}

export interface ActiveTrial {
    id: string,
    /** Emojis to draw this run to complete it, set when it starts */
    goal: number,
    completed: boolean,
}

export const MAX_HISTORY = 10;

export const PRESTIGE_STATE_VERSION = 1;

const initialState: PrestigeState = {
    emojiEssence: 0,
    totalEssenceEarned: 0,
    prestiges: 0,
    perks: [],
    runStartEmojis: 0,
    remainingEmojisPrestigePerc: 0,
    version: PRESTIGE_STATE_VERSION,
};

export const prestigeSlice = createSlice({
    name: "prestige",
    initialState,
    reducers: {
        /** A prestige: banks the new essence and starts a new run */
        completePrestige: (state, action: PayloadAction<{ essence: number, runStartEmojis: number, trial?: ActiveTrial }>) => {
            const run: PastRun = {
                essence: action.payload.essence,
                seconds: state.runSeconds ?? 0,
                emojis: action.payload.runStartEmojis - state.runStartEmojis,
            };
            if (state.activeTrial) {
                run.trial = state.activeTrial.id;
                run.trialCompleted = state.activeTrial.completed;
            }
            state.history = [run, ...(state.history ?? [])].slice(0, MAX_HISTORY);

            state.emojiEssence += action.payload.essence;
            state.totalEssenceEarned += action.payload.essence;
            state.prestiges += 1;
            state.runStartEmojis = action.payload.runStartEmojis;
            state.lastRunPeakEps = state.runPeakEps ?? 0;
            state.runPeakEps = 0;
            state.runSeconds = 0;
            state.runBestEssenceRate = 0;
            state.activeTrial = action.payload.trial;
        },
        /** Essence on top of what the emojis drawn are worth (the Essence charm, bought with gems) */
        addBonusEssence: (state, action: PayloadAction<number>) => {
            state.emojiEssence += action.payload;
        },
        addRunSeconds: (state, action: PayloadAction<number>) => {
            state.runSeconds = (state.runSeconds ?? 0) + action.payload;
        },
        setRunBestEssenceRate: (state, action: PayloadAction<number>) => {
            state.runBestEssenceRate = action.payload;
        },
        /** The goal is reached: the restriction lifts for the rest of the run, and the reward is kept forever */
        completeTrial: (state) => {
            if (!state.activeTrial || state.activeTrial.completed) return;
            state.activeTrial.completed = true;
            const done = state.trialsCompleted ?? [];
            if (!done.includes(state.activeTrial.id)) state.trialsCompleted = [...done, state.activeTrial.id];
        },
        /** Gives up on the trial: the restriction lifts, without the reward */
        abandonTrial: (state) => {
            state.activeTrial = undefined;
        },
        setRunPeakEps: (state, action: PayloadAction<number>) => {
            state.runPeakEps = action.payload;
        },
        buyPerk: (state, action: PayloadAction<{ id: string, cost: number }>) => {
            if (state.perks.includes(action.payload.id) || state.emojiEssence < action.payload.cost) return;
            state.emojiEssence -= action.payload.cost;
            state.perks.push(action.payload.id);
        },
        /** Cheat: free essence and perk tiers, for testing perks */
        cheatPrestige: (state, action: PayloadAction<{ essence?: number, tiers?: number }>) => {
            state.emojiEssence += action.payload.essence ?? 0;
            state.totalEssenceEarned += action.payload.essence ?? 0;
            state.prestiges += action.payload.tiers ?? 0;
        },
        /** Takes away perks that no longer exist and gives their essence back */
        refundPerks: (state, action: PayloadAction<{ id: string, cost: number }[]>) => {
            action.payload.forEach(({ id, cost }) => {
                if (!state.perks.includes(id)) return;
                state.perks = state.perks.filter(owned => owned !== id);
                state.emojiEssence += cost;
            });
        },
        setLastSeen: (state, action: PayloadAction<number>) => {
            state.lastSeen = action.payload;
        },
        updateRemainingEmojisPrestigePerc: (state, action: PayloadAction<number>) => {
            state.remainingEmojisPrestigePerc = action.payload;
        },
        /**
         * Saves from before prestige worked had essence recalculated from emojis drawn but
         * never earned. Start them at zero; the first prestige pays out everything they've drawn.
         */
        migratePrestige: (state) => {
            return { ...initialState, lastSeen: state.lastSeen };
        },
        resetPrestige: () => {
            return initialState;
        },
    },
});

export const { completePrestige, addBonusEssence, addRunSeconds, setRunBestEssenceRate, completeTrial, abandonTrial, setRunPeakEps, buyPerk, cheatPrestige, refundPerks, setLastSeen, updateRemainingEmojisPrestigePerc, migratePrestige, resetPrestige } = prestigeSlice.actions;

export default prestigeSlice.reducer;
