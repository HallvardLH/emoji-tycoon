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
    baseEmojisPerTap: number,
    emojisPerTap: number;
    eptMult: number;
    eptAdd: number;
    effectDuration: number;

}

const initialState: BigEmojiState = {
    bigEmoji: "😀",
    nextEmoji: "😍",
    baseEmojisPerTap: 1,
    emojisPerTap: 1,
    eptMult: 0,
    eptAdd: 0,
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
        updateEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        updateBaseEmojisPerTap: (state, action: PayloadAction<number>) => {
            state.emojisPerTap = action.payload;
        },
        updateEptMult: (state, action: PayloadAction<number>) => {
            state.eptMult = action.payload;
        },
        updateEptAdd: (state, action: PayloadAction<number>) => {
            state.eptAdd = action.payload;
        },
        updateEffectDuration: (state, action: PayloadAction<number>) => {
            state.effectDuration = action.payload;
        },
        resetBigEmoji: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBigEmoji, updateNextEmoji, updateEmojisPerTap, updateBaseEmojisPerTap, updateEptMult, updateEptAdd, updateEffectDuration, resetBigEmoji } = bigEmojiSlice.actions;

export default bigEmojiSlice.reducer;
