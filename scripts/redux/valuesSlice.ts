import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ValuesState {
    emojis: number;
    bigEmoji: string;
    eps: number;
}

const initialState: ValuesState = {
    emojis: 1000,
    bigEmoji: "😀",
    eps: 0,
};

// Create the slice with reducers properly typed
export const valuesSlice = createSlice({
    name: "values",
    initialState,
    reducers: {
        updateEmojis: (state, action: PayloadAction<number>) => {
            state.emojis = action.payload;
        },
        updateBigEmoji: (state, action: PayloadAction<string>) => {
            state.bigEmoji = action.payload;
        },
        updateEps: (state, action: PayloadAction<number>) => {
            state.eps = action.payload;
        },
        resetValues: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { updateEmojis, updateBigEmoji, updateEps, resetValues } = valuesSlice.actions;

export default valuesSlice.reducer;
