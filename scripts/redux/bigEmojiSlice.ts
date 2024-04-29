import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BigEmojiState {
    bigEmoji: string;
    nextEmoji: string;
    nextEffect: string;
    baseEmojisPerTap: number,
    emojisPerTap: number;
    eptMult: number;
    eptAdd: number;
}

const initialState: BigEmojiState = {
    bigEmoji: "😀",
    nextEmoji: "",
    nextEffect: "none",
    baseEmojisPerTap: 1,
    emojisPerTap: 1,
    eptMult: 1,
    eptAdd: 0,
};

export const bigEmojiSlice = createSlice({
    name: "bigEmoji",
    initialState,
    reducers: {
        updateBigEmoji: (state, action: PayloadAction<string>) => {
            state.bigEmoji = action.payload;
        },
        updateEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        updateBaseEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        resetBigEmoji: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBigEmoji, updateEmojisPerTap, updateBaseEmojisPerTap, resetBigEmoji } = bigEmojiSlice.actions;

export default bigEmojiSlice.reducer;
