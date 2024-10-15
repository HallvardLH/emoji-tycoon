import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PrestigeState {
    /** 
    * @property Essentially prestige points
    */
    emojiEssence: number,
    remainingEmojisPrestigePerc: number;
}

const initialState: PrestigeState = {
    emojiEssence: 0,
    remainingEmojisPrestigePerc: 0,
};

export const prestigeSlice = createSlice({
    name: "prestige",
    initialState,
    reducers: {
        updateEmojiEssence: (state, action: PayloadAction<number>) => {
            state.emojiEssence = action.payload;
        },
        updateRemainingEmojisPrestigePerc: (state, action: PayloadAction<number>) => {
            state.remainingEmojisPrestigePerc = action.payload;
        },
        resetPrestige: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateEmojiEssence, updateRemainingEmojisPrestigePerc, resetPrestige } = prestigeSlice.actions;

export default prestigeSlice.reducer;