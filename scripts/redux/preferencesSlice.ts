import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BuildingNames } from '../game/buildings/buildingNamesType';
import { buildingData } from '../game/buildings/buildingData';
import { LanguagePreference } from '../../i18n';

export type upgradeFilters = BuildingNames | "all";

/** How many buildings the buy button buys. "max" buys as many as you can afford. */
export type BulkBuyAmount = 1 | 10 | 100 | "max";

interface PreferencesState {
    /** 
    * @property The amount of buildings that are bought by clicking the buy button
    */
    bulkBuy: BulkBuyAmount,
    /** 
    * @property Whether to show extra details, namely in upgrade list items
    */
    showDetails: boolean,
    /** 
    * @property An array of buildings for which to show upgrades for in the upgrade screen
    */
    upgradeFilter: upgradeFilters[],
    /** 
    * @property The language of the game, "system" follows the device language
    */
    language: LanguagePreference,
    /**
    * @property Skips the heaviest animations, chiefly the emojis flying off the Big Emoji.
    * Missing from saves made before it existed, so read it as off when undefined.
    */
    reduceAnimations?: boolean,
    /**
    * @property Sound effects for tapping. Missing from saves made before it existed, so read it as on when undefined.
    */
    soundEffects?: boolean,
}

const initialState: PreferencesState = {
    bulkBuy: 1,
    showDetails: true,
    upgradeFilter: [
        ...buildingData.map(building => building.name as BuildingNames),
        "Big emoji" as BuildingNames,
    ],
    language: "system",
    reduceAnimations: false,
    soundEffects: true,
};

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        updateBulkBuy: (state, action: PayloadAction<BulkBuyAmount>) => {
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
        setLanguage: (state, action: PayloadAction<LanguagePreference>) => {
            state.language = action.payload;
        },
        updateSoundEffects: (state, action: PayloadAction<boolean>) => {
            state.soundEffects = action.payload;
        },
        updateReduceAnimations: (state, action: PayloadAction<boolean>) => {
            state.reduceAnimations = action.payload;
        },
        resetPreferences: (state) => {
            // Settings are about the device, not the save, so they survive a reset
            return {
                ...initialState,
                language: state.language,
                reduceAnimations: state.reduceAnimations ?? false,
                soundEffects: state.soundEffects ?? true,
            };
        },

    },
});

export const { updateBulkBuy, updateShowDetails, toggleUpgradeFilter, setLanguage, updateReduceAnimations, updateSoundEffects, resetPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;