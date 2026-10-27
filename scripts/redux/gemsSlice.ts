import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Gems, the premium currency, and everything bought with them (see gemShop.ts)
 *
 * Kept through prestiges and game resets, since players may have paid for them.
 * Saves from before a field existed load without it, so read the optional ones
 * with a default (the save is merged in one slice at a time, not field by field).
 */
interface GemsState {
    gems: number;
    /** Gem rewards already paid, by key ("trophy:taps1", "bank:2", "prestige:3"), so each pays once ever */
    rewarded?: string[];
    /** When the gem boost (×2 production and taps) runs out, as a timestamp in ms */
    boostUntil?: number;
    /** When the combo keeper (no combo drain) runs out, as a timestamp in ms */
    comboKeeperUntil?: number;
    /** Big Emojis still to come that are guaranteed to be ones never found before */
    discoveries?: number;
    /** The next prestige gives extra essence (Essence charm) */
    essenceCharm?: boolean;
    /** App themes bought, and the one in use (see themes.ts) */
    themes?: string[];
    theme?: string;
}

const initialState: GemsState = {
    gems: 0,
    rewarded: [],
    discoveries: 0,
    themes: [],
    theme: "classic",
};

export const gemsSlice = createSlice({
    name: "gems",
    initialState,
    reducers: {
        addGems: (state, action: PayloadAction<number>) => {
            state.gems += Math.max(0, Math.floor(action.payload));
        },
        /** Does nothing if there aren't enough; spend through spendGems in monetization.ts */
        spendGems: (state, action: PayloadAction<number>) => {
            if (state.gems >= action.payload) state.gems -= action.payload;
        },
        markRewarded: (state, action: PayloadAction<string[]>) => {
            const rewarded = state.rewarded ?? [];
            action.payload.forEach(key => { if (!rewarded.includes(key)) rewarded.push(key); });
            state.rewarded = rewarded;
        },
        setBoostUntil: (state, action: PayloadAction<number>) => {
            state.boostUntil = action.payload;
        },
        setComboKeeperUntil: (state, action: PayloadAction<number>) => {
            state.comboKeeperUntil = action.payload;
        },
        addDiscoveries: (state, action: PayloadAction<number>) => {
            state.discoveries = Math.max(0, (state.discoveries ?? 0) + action.payload);
        },
        setEssenceCharm: (state, action: PayloadAction<boolean>) => {
            state.essenceCharm = action.payload;
        },
        unlockTheme: (state, action: PayloadAction<string>) => {
            const themes = state.themes ?? [];
            if (!themes.includes(action.payload)) themes.push(action.payload);
            state.themes = themes;
        },
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
    },
});

export const {
    addGems,
    spendGems,
    markRewarded,
    setBoostUntil,
    setComboKeeperUntil,
    addDiscoveries,
    setEssenceCharm,
    unlockTheme,
    setTheme,
} = gemsSlice.actions;

export default gemsSlice.reducer;
