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
}

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
        completePrestige: (state, action: PayloadAction<{ essence: number, runStartEmojis: number }>) => {
            state.emojiEssence += action.payload.essence;
            state.totalEssenceEarned += action.payload.essence;
            state.prestiges += 1;
            state.runStartEmojis = action.payload.runStartEmojis;
            state.lastRunPeakEps = state.runPeakEps ?? 0;
            state.runPeakEps = 0;
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

export const { completePrestige, setRunPeakEps, buyPerk, cheatPrestige, setLastSeen, updateRemainingEmojisPrestigePerc, migratePrestige, resetPrestige } = prestigeSlice.actions;

export default prestigeSlice.reducer;
