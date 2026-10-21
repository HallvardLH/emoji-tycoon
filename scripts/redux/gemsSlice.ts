import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Gems, the premium currency
 *
 * Kept through prestiges and game resets, since players may have paid for them.
 */
interface GemsState {
    gems: number;
}

const initialState: GemsState = {
    gems: 0,
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
    },
});

export const { addGems, spendGems } = gemsSlice.actions;

export default gemsSlice.reducer;
