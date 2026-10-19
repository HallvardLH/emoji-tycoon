import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Achievements unlocked (see achievements.ts). All-time: kept through prestige,
 * lost only when the game is reset.
 */
interface AchievementsState {
    /** Ids of the achievements unlocked, oldest first */
    unlocked: string[];
    /**
     * Whether the achievements have been checked against this save before. The first
     * check unlocks what's already earned quietly, so a save from before achievements
     * existed doesn't get dozens of banners at once.
     */
    checked: boolean;
}

const initialState: AchievementsState = {
    unlocked: [],
    checked: false,
};

export const achievementsSlice = createSlice({
    name: "achievements",
    initialState,
    reducers: {
        unlockAchievements: (state, action: PayloadAction<string[]>) => {
            action.payload.forEach(id => {
                if (!state.unlocked.includes(id)) state.unlocked.push(id);
            });
            state.checked = true;
        },
        resetAchievements: () => {
            return initialState;
        },
    },
});

export const { unlockAchievements, resetAchievements } = achievementsSlice.actions;

export default achievementsSlice.reducer;
