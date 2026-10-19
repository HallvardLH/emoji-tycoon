import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface StatsState {
    emojisGained: number;
    /** 
    * @property The amount of times the big emoji has been tapped
    * Nobody can say I don't TRY to add documentation to my code
    */
    bigEmojiTaps: number,
    emojisEarnedFromTap: number,
    effectEmojisCollected: number,
    shinyEmojisTapped: number,
    /**
     * Taps weighted by the combo multiplier at the time (a tap at ×3 counts 3).
     * Unlocks combo level upgrades. Undefined in saves from before it existed.
     */
    comboTaps?: number,
    /**
     * The highest emojis-drawn milestone celebrated, as a power of 1000 (1 = a thousand, 2 = a million...).
     * Undefined in saves from before milestones existed.
     */
    bankMilestone?: number,
    /**
     * Emojis each building has made in total, by building id, with every buff counted
     * (see creditBuildings). Undefined in saves from before it existed.
     */
    buildingEmojis?: Record<number, number>,
    /** The highest combo multiplier reached. Undefined in saves from before it existed */
    bestCombo?: number,
}

const initialState: StatsState = {
    emojisGained: 0,
    bigEmojiTaps: 0,
    emojisEarnedFromTap: 0,
    effectEmojisCollected: 0,
    shinyEmojisTapped: 0,
    comboTaps: 0,
    bankMilestone: 0,
    buildingEmojis: {},
    bestCombo: 1,
};

export const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        addEmojisGained: (state, action: PayloadAction<number>) => {
            // Never NaN or Infinity, which would stick (see updateEmojis)
            if (Number.isFinite(action.payload)) state.emojisGained += action.payload;
        },
        addBigEmojiTaps: (state, action: PayloadAction<number>) => {
            // console.log(state.bigEmojiTaps, action.payload)
            state.bigEmojiTaps += action.payload;
        },
        addEmojisEarnedFromTap: (state, action: PayloadAction<number>) => {
            state.emojisEarnedFromTap = state.emojisEarnedFromTap + action.payload;
        },
        addEffectEmojisCollected: (state, action: PayloadAction<number>) => {
            state.effectEmojisCollected = state.effectEmojisCollected + action.payload;
        },
        addShinyEmojiTapped: (state) => {
            state.shinyEmojisTapped = (state.shinyEmojisTapped ?? 0) + 1;
        },
        setBankMilestone: (state, action: PayloadAction<number>) => {
            state.bankMilestone = action.payload;
        },
        setBestCombo: (state, action: PayloadAction<number>) => {
            state.bestCombo = Math.max(state.bestCombo ?? 1, action.payload);
        },
        setComboTaps: (state, action: PayloadAction<number>) => {
            state.comboTaps = action.payload;
        },
        updateTapStats: (state, action: PayloadAction<{
            emojisGained: number;
            bigEmojiTaps: number;
            emojisEarnedFromTap: number;
            comboTaps: number;
        }>) => {
            state.emojisGained += action.payload.emojisGained;
            state.bigEmojiTaps += action.payload.bigEmojiTaps;
            state.emojisEarnedFromTap += action.payload.emojisEarnedFromTap;
            state.comboTaps = (state.comboTaps ?? 0) + action.payload.comboTaps;
        },
        /** Adds to what each building has made, by building id */
        addBuildingEmojis: (state, action: PayloadAction<Record<number, number>>) => {
            const totals = state.buildingEmojis ?? (state.buildingEmojis = {});
            for (const [id, amount] of Object.entries(action.payload)) {
                totals[Number(id)] = (totals[Number(id)] ?? 0) + amount;
            }
        },
        resetStats: (state) => {
            return initialState;
        },

    },
});

export const { addBigEmojiTaps, addEmojisGained, addEmojisEarnedFromTap, addEffectEmojisCollected, addShinyEmojiTapped, setBankMilestone, setBestCombo, setComboTaps, updateTapStats, addBuildingEmojis, resetStats } = statsSlice.actions;

export default statsSlice.reducer;