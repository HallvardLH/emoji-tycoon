import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ValuesState {
    emojis: number;
    eps: number;
    epsMult: number;
}

const initialState: ValuesState = {
    emojis: 0,
    eps: 0,
    epsMult: 0,
};

// Create the slice with reducers properly typed
export const valuesSlice = createSlice({
    name: "values",
    initialState,
    reducers: {
        updateEmojis: (state, action: PayloadAction<number>) => {
            state.emojis = action.payload;
        },
        updateEps: (state, action: PayloadAction<number>) => {
            state.eps = action.payload;
        },
        updateEpsMult: (state, action: PayloadAction<number>) => {
            state.epsMult = action.payload;
        },
        resetValues: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { updateEmojis, updateEps, updateEpsMult, resetValues } = valuesSlice.actions;

export default valuesSlice.reducer;
