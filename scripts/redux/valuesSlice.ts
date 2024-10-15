import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ValuesState {
    emojis: number;
    emojisPerSecond: number;
    emojisPerSecondPercentages: number[],
    // The total amunt of emojis per second from all buildings combined
    totalBuildingEps: number;
    funValue: number;
}

const initialState: ValuesState = {
    emojis: 1e30,
    emojisPerSecond: 0,
    emojisPerSecondPercentages: [],
    totalBuildingEps: 0,
    funValue: Math.floor(Math.random() * 100) + 1,
};

// Create the slice with reducers properly typed
export const valuesSlice = createSlice({
    name: "values",
    initialState,
    reducers: {
        updateEmojis: (state, action: PayloadAction<number>) => {
            state.emojis = action.payload;
        },
        updateEmojisPerSecond: (state, action: PayloadAction<number>) => {
            state.emojisPerSecond = action.payload;
        },
        updateTotalBuildingEps: (state, action: PayloadAction<number>) => {
            state.totalBuildingEps = action.payload;
        },

        addEmojisPerSecondPercentage: (state, action: PayloadAction<number>) => {
            state.emojisPerSecondPercentages.push(action.payload);
        },
        removeEmojisPerSecondPercentage: (state, action: PayloadAction<number>) => {
            const index = state.emojisPerSecondPercentages.indexOf(action.payload);
            if (index !== -1) {
                state.emojisPerSecondPercentages.splice(index, 1);
            }
        },

        resetValues: (state) => {
            return {
                ...initialState,
                funValue: Math.floor(Math.random() * 100) + 1, // Recalculate funValue on reset
            };
        },

    },
});

// Export the generated action creators
export const { updateEmojis, updateEmojisPerSecond, updateTotalBuildingEps, addEmojisPerSecondPercentage, removeEmojisPerSecondPercentage, resetValues } = valuesSlice.actions;

export default valuesSlice.reducer;
