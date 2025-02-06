import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PreferencesState {
    /** 
    * @property The amount of buildings that are bought by clicking the buy button
    */
    bulkBuy: 1 | 10 | 100,
    showDetails: boolean,
}

const initialState: PreferencesState = {
    bulkBuy: 1,
    showDetails: false,
};

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        updateBulkBuy: (state, action: PayloadAction<1 | 10 | 100>) => {
            state.bulkBuy = action.payload;
        },
        updateShowDetails: (state, action: PayloadAction<boolean>) => {
            state.showDetails = action.payload;
        },
        resetPreferences: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBulkBuy, updateShowDetails, resetPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;