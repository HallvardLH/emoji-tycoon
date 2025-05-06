import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
    activeTab: 'emoji' | 'buildings' | 'upgrades' | 'emojidex';
}

const initialState: TabState = {
    activeTab: 'emoji',
};

export const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<TabState['activeTab']>) => {
            state.activeTab = action.payload;
        },
        resetTab: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { setActiveTab, resetTab } = tabSlice.actions;

export default tabSlice.reducer;