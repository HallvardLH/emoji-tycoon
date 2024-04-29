import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ValuesState {
    bigEmoji: string;
    nextEmoji: string;
    nextEffect: string;
}

const initialState: ValuesState = {
    bigEmoji: "😀",
    nextEmoji: "",
    nextEffect: "none"
};

// Create the slice with reducers properly typed
export const valuesSlice = createSlice({
    name: "values",
    initialState,
    reducers: {
        updateBigEmoji: (state, action: PayloadAction<string>) => {
            state.bigEmoji = action.payload;
        },
        resetValues: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { updateBigEmoji, resetValues } = valuesSlice.actions;

export default valuesSlice.reducer;
