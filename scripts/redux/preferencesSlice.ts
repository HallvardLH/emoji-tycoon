import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PreferencesState {
    /** 
    * @property The amount of buildings that are bought by clicking the buy button
    */
    bulkBuy: 1 | 10 | 100,
}

const initialState: PreferencesState = {
    bulkBuy: 1,
};

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        updateBulkBuy: (state, action: PayloadAction<1 | 10 | 100>) => {
            state.bulkBuy = action.payload;
        },
        resetPreferences: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBulkBuy, resetPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;