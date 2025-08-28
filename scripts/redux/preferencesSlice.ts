import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildingNames } from '../game/buildings/buildingNamesType';
import { buildingData } from '../game/buildings/buildingData';

export type upgradeFilters = BuildingNames | "all";

interface PreferencesState {
    /** 
    * @property The amount of buildings that are bought by clicking the buy button
    */
    bulkBuy: 1 | 10 | 100,
    /** 
    * @property Whether to show extra details, namely in upgrade list items
    */
    showDetails: boolean,
    /** 
    * @property An array of buildings for which to show upgrades for in the upgrade screen
    */
    upgradeFilter: upgradeFilters[],
}

const initialState: PreferencesState = {
    bulkBuy: 1,
    showDetails: true,
    upgradeFilter: [
        ...buildingData.map(building => building.name as BuildingNames),
        "Big emoji" as BuildingNames,
    ],
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
        toggleUpgradeFilter: (state, action: PayloadAction<upgradeFilters>) => {
            let currentFilters = [...state.upgradeFilter];
            // If the filter is in the array, remove it
            if (currentFilters.includes(action.payload)) {
                currentFilters = currentFilters.filter(upgrade => upgrade != action.payload);
            } else {
                currentFilters.push(action.payload);
            }
            state.upgradeFilter = currentFilters;
        },
        resetPreferences: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateBulkBuy, updateShowDetails, toggleUpgradeFilter, resetPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;