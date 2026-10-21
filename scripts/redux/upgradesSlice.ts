import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UpgradesState {
    owned: number[];
    unlocked: number[];
    canBuy: number[]
    /** Affordable upgrades the player has already seen on the Upgrades tab (not counted in its badge) */
    seenCanBuy?: number[];
}

const initialState: UpgradesState = {
    owned: [],
    unlocked: [],
    canBuy: [],
};

/**
 * How many affordable upgrades the player hasn't seen on the Upgrades tab yet.
 * The badge on the Upgrades tab, and the upgrades part of the badge on the Shop tab
 */
export const selectNewAffordableUpgrades = (state: { upgrades: UpgradesState }) => {
    const seen = state.upgrades.seenCanBuy ?? [];
    return state.upgrades.canBuy.filter(id => !seen.includes(id)).length;
};

export const upgradesSlice = createSlice({
    name: "upgrades",
    initialState,
    reducers: {
        addUpgrade: (state, action: PayloadAction<number>) => {
            if (!state.owned.includes(action.payload)) {
                state.owned.push(action.payload);
            }
            // Remove the upgrade from unlocked, and from affordable (it used to linger there)
            state.unlocked = state.unlocked.filter(element => element !== action.payload);
            state.canBuy = state.canBuy.filter(element => element !== action.payload);
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
        /** Drops upgrade ids that aren't in the game anymore, e.g. from saves made before upgrades moved */
        keepKnownUpgrades: (state, action: PayloadAction<number[]>) => {
            const known = new Set(action.payload);
            state.owned = state.owned.filter(id => known.has(id));
            state.unlocked = state.unlocked.filter(id => known.has(id));
            // Only upgrades for sale can be affordable
            state.canBuy = state.canBuy.filter(id => known.has(id) && state.unlocked.includes(id));
            if (state.seenCanBuy) state.seenCanBuy = state.seenCanBuy.filter(id => known.has(id));
        },
        /** The Upgrades tab is open: everything affordable now has been seen */
        markAffordableUpgradesSeen: (state) => {
            const seen = new Set([...(state.seenCanBuy ?? []), ...state.canBuy]);
            // Forget bought upgrades
            const next = [...seen].filter(id => state.unlocked.includes(id));
            if (next.length !== (state.seenCanBuy ?? []).length || next.some(id => !state.seenCanBuy!.includes(id))) {
                state.seenCanBuy = next;
            }
        },
        resetUpgrades: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { addUpgrade, unlockUpgrade, addCanBuyUpgrade, removeCanBuyUpgrade, keepKnownUpgrades, markAffordableUpgradesSeen, resetUpgrades } = upgradesSlice.actions;

export default upgradesSlice.reducer;