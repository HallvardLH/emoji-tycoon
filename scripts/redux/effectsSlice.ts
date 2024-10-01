import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Effect } from '../game/effects/effectType';

interface EffectsState {
    timeSinceLastEffect: number;
    effectDuration: number;
    /** 
    * @property An array of numbers which increase effect duration. 
    * These are added together, and base effect duration is multiplied by that number
    */
    effectDurationIncreasers: number[];
    /** 
    * @property An array of numbers which increase chance of an effect spawning. 
    */
    effectSpawnChanceIncreasers: number[];
    effects: Effect[];
    effectsOnScreen: Effect[];
}

const initialState: EffectsState = {
    timeSinceLastEffect: 0,
    effectDuration: 10,
    effectDurationIncreasers: [],
    effectSpawnChanceIncreasers: [1],
    effects: [],
    effectsOnScreen: [],
};

export const effectsSlice = createSlice({
    name: "effects",
    initialState,
    reducers: {
        updateEffectDuration: (state, action: PayloadAction<number>) => {
            state.effectDuration = action.payload;
        },
        updateTimeSinceLastEffect: (state, action: PayloadAction<number>) => {
            state.timeSinceLastEffect = action.payload;
        },

        removeEffect: (state, action: PayloadAction<number>) => {
            state.effects = state.effects.filter(effect => effect.instanceId !== action.payload);
        },
        addEffect: (state, action: PayloadAction<Effect>) => {
            state.effects.push(action.payload);
        },
        updateTimeLeft: (state, action: PayloadAction<{ id: number; timeLeft: number }>) => {
            const effect = state.effects.find(effect => effect.instanceId === action.payload.id);
            if (effect) {
                effect.timeLeft = action.payload.timeLeft;
            }
        },

        removeEffectOnScreen: (state, action: PayloadAction<number>) => {
            state.effectsOnScreen = state.effectsOnScreen.filter(effect => effect.instanceId !== action.payload);
        },
        addEffectOnScreen: (state, action: PayloadAction<Effect>) => {
            state.effectsOnScreen.push(action.payload);
        },
        updateTimeLeftOnScreen: (state, action: PayloadAction<{ id: number; timeLeftOnScreen: number }>) => {
            const effect = state.effectsOnScreen.find(effect => effect.instanceId === action.payload.id);
            if (effect) {
                effect.timeLeftOnScreen = action.payload.timeLeftOnScreen;
            }
        },

        addEffectDurationIncreasers: (state, action: PayloadAction<number>) => {
            state.effectDurationIncreasers.push(action.payload);
        },
        removeEffectDurationIncreasers: (state, action: PayloadAction<number>) => {
            const index = state.effectDurationIncreasers.indexOf(action.payload);
            if (index !== -1) {
                state.effectDurationIncreasers.splice(index, 1);
            }
        },

        addEffectSpawnChanceIncreasers: (state, action: PayloadAction<number>) => {
            state.effectSpawnChanceIncreasers.push(action.payload);
        },
        removeEffectSpawnChanceIncreasers: (state, action: PayloadAction<number>) => {
            const index = state.effectSpawnChanceIncreasers.indexOf(action.payload);
            if (index !== -1) {
                state.effectSpawnChanceIncreasers.splice(index, 1);
            }
        },

        resetEffects: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const {
    updateEffectDuration,
    updateTimeSinceLastEffect,
    removeEffect,
    addEffect,
    updateTimeLeft,
    removeEffectOnScreen,
    addEffectOnScreen,
    updateTimeLeftOnScreen,
    addEffectDurationIncreasers,
    removeEffectDurationIncreasers,
    addEffectSpawnChanceIncreasers,
    removeEffectSpawnChanceIncreasers,
    resetEffects
} = effectsSlice.actions;

export default effectsSlice.reducer;
