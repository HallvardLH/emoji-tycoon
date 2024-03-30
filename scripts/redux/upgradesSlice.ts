import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpgradesState {
    owned: number[];
    unlocked: number[];
    notifications: number;
}

const initialState: UpgradesState = {
    owned: [],
    unlocked: [],
    notifications: 0,
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
                    state.notifications++;
                }
            }
        },
        clearNotifications: (state) => {
            state.notifications = 0;
        },
        resetUpgrades: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { addUpgrade, unlockUpgrade, clearNotifications, resetUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;