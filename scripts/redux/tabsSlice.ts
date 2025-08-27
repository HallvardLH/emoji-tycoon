import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Tab = 'Shop' | 'Emoji' | 'Emojidex';
interface TabsState {
    activeTab: Tab;
}

const initialState: TabsState = {
    activeTab: 'Emoji',
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