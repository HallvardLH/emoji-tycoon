import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BigEmoji = {
    emoji: string,
    category: string,
    id: number,
}

interface BigEmojiState {
    /** 
    * @property The emoji currently being displayed
    */
    bigEmoji: BigEmoji;
    /** 
    * @property The emoji that is to be displayed next
    */
    nextEmoji: BigEmoji;

    baseEmojisPerTap: number,
    emojisPerTap: number;
    eptMult: number;
    eptAdd: number;
}

const initialState: BigEmojiState = {
    bigEmoji: {
        emoji: "😀",
        category: "faces",
        id: 0,
    },
    nextEmoji: {
        emoji: "😍",
        category: "faces",
        id: 15,
    },
    baseEmojisPerTap: 1,
    emojisPerTap: 1,
    eptMult: 0,
    eptAdd: 0,
};

export const bigEmojiSlice = createSlice({
    name: "bigEmoji",
    initialState,
    reducers: {
        updateBigEmoji: (state, action: PayloadAction<BigEmoji>) => {
            state.bigEmoji = action.payload;
        },
        updateNextEmoji: (state, action: PayloadAction<BigEmoji>) => {
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
        resetBigEmoji: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBigEmoji, updateNextEmoji, updateEmojisPerTap, updateBaseEmojisPerTap, updateEptMult, updateEptAdd, resetBigEmoji } = bigEmojiSlice.actions;

export default bigEmojiSlice.reducer;
