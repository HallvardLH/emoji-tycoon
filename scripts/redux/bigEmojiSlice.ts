import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BigEmojiState {
    /** 
    * @property The emoji currently being displayed
    */
    bigEmoji: string;
    /** 
    * @property The emoji that is to be displayed next
    */
    nextEmoji: string;
    nextEffect: string;
    baseEmojisPerTap: number,
    emojisPerTap: number;
    eptMult: number;
    eptAdd: number;
    timeSinceLastEffect: number;
    effectDuration: number;

}

const initialState: BigEmojiState = {
    bigEmoji: "😀",
    nextEmoji: "😍",
    nextEffect: "none",
    baseEmojisPerTap: 1,
    emojisPerTap: 1,
    eptMult: 1,
    eptAdd: 0,
    timeSinceLastEffect: 0,
    effectDuration: 10,
};

export const bigEmojiSlice = createSlice({
    name: "bigEmoji",
    initialState,
    reducers: {
        updateBigEmoji: (state, action: PayloadAction<string>) => {
            state.bigEmoji = action.payload;
        },
        updateNextEmoji: (state, action: PayloadAction<string>) => {
            state.nextEmoji = action.payload;
        },
        updateNextEffect: (state, action: PayloadAction<string>) => {
            state.nextEffect = action.payload;
        },
        updateEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        updateBaseEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        updateEptMult: (state, action: PayloadAction<number>) => {
            state.eptMult = action.payload;
        },
        updateEffectDuration: (state, action: PayloadAction<number>) => {
            state.effectDuration = action.payload;
        },
        updateTimeSinceLastEffect: (state, action: PayloadAction<number>) => {
            state.timeSinceLastEffect = action.payload;
        },
        resetBigEmoji: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBigEmoji, updateNextEmoji, updateNextEffect, updateEmojisPerTap, updateBaseEmojisPerTap, updateEptMult, updateEffectDuration, updateTimeSinceLastEffect, resetBigEmoji } = bigEmojiSlice.actions;

export default bigEmojiSlice.reducer;
