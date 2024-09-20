import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addEmojisPerSecondPercentage } from './valuesSlice';

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
    emojisPerTap: number,
    emojisPerTapMultipliers: number[],
    emojisPerTapPercentages: number[],
    emojisPerTapPercentageOfEps: number[],
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
    emojisPerTapMultipliers: [],
    emojisPerTapPercentages: [],
    emojisPerTapPercentageOfEps: [],
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


        addTapMultiplier: (state, action: PayloadAction<number>) => {
            state.emojisPerTapMultipliers.push(action.payload);
        },
        removeTapMultiplier: (state, action: PayloadAction<number>) => {
            const index = state.emojisPerTapMultipliers.indexOf(action.payload);
            if (index !== -1) {
                state.emojisPerTapMultipliers.splice(index, 1);
            }
        },

        addTapPercentage: (state, action: PayloadAction<number>) => {
            state.emojisPerTapPercentages.push(action.payload);
        },
        removeTapPercentage: (state, action: PayloadAction<number>) => {
            const index = state.emojisPerTapPercentages.indexOf(action.payload);
            if (index !== -1) {
                state.emojisPerTapPercentages.splice(index, 1);
            }
        },

        addEmojisPerTapPercentageOfEps: (state, action: PayloadAction<number>) => {
            state.emojisPerTapPercentageOfEps.push(action.payload);
        },
        removeEmojisPerTapPercentageOfEps: (state, action: PayloadAction<number>) => {
            const index = state.emojisPerTapPercentageOfEps.indexOf(action.payload);
            if (index !== -1) {
                state.emojisPerTapPercentageOfEps.splice(index, 1);
            }
        },

        resetBigEmoji: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBigEmoji, updateNextEmoji, updateEmojisPerTap, updateBaseEmojisPerTap, addTapMultiplier, removeTapMultiplier, addTapPercentage, removeTapPercentage, addEmojisPerTapPercentageOfEps, removeEmojisPerTapPercentageOfEps, resetBigEmoji } = bigEmojiSlice.actions;

export default bigEmojiSlice.reducer;
