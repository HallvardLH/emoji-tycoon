import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface StatsState {
    /** 
    * @property The amount of times the big emoji has been tapped
    */
    bigEmojiTaps: number,
    emojisEarnedFromTap: number,
    effectEmojisCollected: number,
}

const initialState: StatsState = {
    bigEmojiTaps: 0,
    emojisEarnedFromTap: 100000000,
    effectEmojisCollected: 0,
};

export const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        addBigEmojiTaps: (state, action: PayloadAction<number>) => {
            state.bigEmojiTaps = state.bigEmojiTaps + action.payload;
        },
        addEmojisEarnedFromTap: (state, action: PayloadAction<number>) => {
            state.emojisEarnedFromTap = state.emojisEarnedFromTap + action.payload;
        },
        addEffectEmojisCollected: (state, action: PayloadAction<number>) => {
            state.effectEmojisCollected = state.effectEmojisCollected + action.payload;
        },
        resetStats: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { addBigEmojiTaps, addEmojisEarnedFromTap, addEffectEmojisCollected, resetStats } = statsSlice.actions;

export default statsSlice.reducer;