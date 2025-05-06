import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpgradesState {
    owned: number[];
    unlocked: number[];
    canBuy: number[]
    unlockedUpgradeNotification: number;
}

const initialState: UpgradesState = {
    owned: [],
    unlocked: [],
    canBuy: [],
    unlockedUpgradeNotification: 0,
};

export const upgradesSlice = createSlice({
    name: "upgrades",
    initialState,
    reducers: {
        addUpgrade: (state, action: PayloadAction<number>) => {
            if (!state.owned.includes(action.payload)) {
                state.owned.push(action.payload);
            }
            // Remove the upgrade from unlocked
            state.unlocked = state.unlocked.filter(element => element !== action.payload);

        },
        unlockUpgrade: (state, action: PayloadAction<number>) => {
            if (!state.unlocked.includes(action.payload)) {
                // Only unlock if not owned
                if (!state.owned.includes(action.payload)) {
                    state.unlocked.push(action.payload);
                }
            }
        },
        addCanBuyUpgrade: (state, action: PayloadAction<number>) => {
            if (!state.canBuy.includes(action.payload)) {
                state.canBuy.push(action.payload);
            }
        },
        removeCanBuyUpgrade: (state, action: PayloadAction<number>) => {
            if (state.canBuy.includes(action.payload)) {
                // Remove the upgrade from canBuy
                state.canBuy = state.canBuy.filter(element => element !== action.payload);
            }

        },
        unlockedUpgradeNotificaiton: (state) => {
            state.unlockedUpgradeNotification++;
        },
        clearUnlockedUpgradeNotifications: (state) => {
            state.unlockedUpgradeNotification = 0;
        },
        resetUpgrades: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { addUpgrade, unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade, unlockedUpgradeNotificaiton, clearUnlockedUpgradeNotifications, resetUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;