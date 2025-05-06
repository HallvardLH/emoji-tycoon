import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabsState {
    activeTab: 'emoji' | 'buildings' | 'upgrades' | 'emojidex';
}

const initialState: TabsState = {
    activeTab: 'emoji',
};

export const tabsSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<TabsState['activeTab']>) => {
            state.activeTab = action.payload;
        },
        resetTabs: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { setActiveTab, resetTabs } = tabsSlice.actions;

export default tabsSlice.reducer;