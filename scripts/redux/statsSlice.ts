import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface StatsState {
    emojisGained: number;
    /** 
    * @property The amount of times the big emoji has been tapped
    * Nobody can say I don't TRY to add documentation to my code
    */
    bigEmojiTaps: number,
    emojisEarnedFromTap: number,
    effectEmojisCollected: number,
}

const initialState: StatsState = {
    emojisGained: 0,
    bigEmojiTaps: 0,
    emojisEarnedFromTap: 0,
    effectEmojisCollected: 0,
};

export const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        addEmojisGained: (state, action: PayloadAction<number>) => {
            state.emojisGained += action.payload;
        },
        addBigEmojiTaps: (state, action: PayloadAction<number>) => {
            // console.log(state.bigEmojiTaps, action.payload)
            state.bigEmojiTaps += action.payload;
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

export const { addBigEmojiTaps, addEmojisGained, addEmojisEarnedFromTap, addEffectEmojisCollected, resetStats } = statsSlice.actions;

export default statsSlice.reducer;