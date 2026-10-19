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
    emojis: 0, //1e30,
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
        // Never NaN or Infinity: one bad calculation would wipe the bank for good, as it
        // stays NaN through every sum after it (and saves as null)
        updateEmojis: (state, action: PayloadAction<number>) => {
            if (Number.isFinite(action.payload)) state.emojis = action.payload;
        },
        updateEmojisPerSecond: (state, action: PayloadAction<number>) => {
            if (Number.isFinite(action.payload)) state.emojisPerSecond = action.payload;
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

        setFunValue: (state, action: PayloadAction<number>) => {
            state.funValue = Math.min(100, Math.max(1, Math.round(action.payload)));
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
export const { updateEmojis, updateEmojisPerSecond, updateTotalBuildingEps, addEmojisPerSecondPercentage, removeEmojisPerSecondPercentage, setFunValue, resetValues } = valuesSlice.actions;

export default valuesSlice.reducer;
