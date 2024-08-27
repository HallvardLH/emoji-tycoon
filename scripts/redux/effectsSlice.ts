import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Effect } from '../game/effects/createEffect';

interface EffectsState {
    nextEffect: string;
    eptMult: number;
    eptAdd: number;
    timeSinceLastEffect: number;
    effectDuration: number;

    effects: Effect[];
    effectsOnScreen: Effect[];
}

const initialState: EffectsState = {
    nextEffect: "none",
    eptMult: 1,
    eptAdd: 0,
    timeSinceLastEffect: 0,
    effectDuration: 10,
    effects: [],
    effectsOnScreen: [],
};

export const effectsSlice = createSlice({
    name: "effects",
    initialState,
    reducers: {
        updateNextEffect: (state, action: PayloadAction<string>) => {
            state.nextEffect = action.payload;
        },
        updateEptMult: (state, action: PayloadAction<number>) => {
            state.eptMult = action.payload;
        },
        updateEffectDuration: (state, action: PayloadAction<number>) => {
            state.effectDuration = action.payload;
        },
        updateTimeSinceLastEffect: (state, action: PayloadAction<number>) => {
            state.timeSinceLastEffect = action.payload;
        },

        removeEffect: (state, action: PayloadAction<number>) => {
            state.effects = state.effects.filter(effect => effect.id !== action.payload);
        },
        addEffect: (state, action: PayloadAction<Effect>) => {
            state.effects.push(action.payload);
        },
        updateTimeLeft: (state, action: PayloadAction<{ id: number; timeLeft: number }>) => {
            const effect = state.effects.find(effect => effect.id === action.payload.id);
            if (effect) {
                effect.timeLeft = action.payload.timeLeft;
            }
        },

        removeEffectOnScreen: (state, action: PayloadAction<number>) => {
            state.effectsOnScreen = state.effectsOnScreen.filter(effect => effect.id !== action.payload);
        },
        addEffectOnScreen: (state, action: PayloadAction<Effect>) => {
            state.effectsOnScreen.push(action.payload);
        },
        updateTimeLeftOnScreen: (state, action: PayloadAction<{ id: number; timeLeftOnScreen: number }>) => {
            const effect = state.effectsOnScreen.find(effect => effect.id === action.payload.id);
            if (effect) {
                effect.timeLeftOnScreen = action.payload.timeLeftOnScreen;
            }
        },

        resetEffects: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const { updateNextEffect, updateEptMult, updateEffectDuration, updateTimeSinceLastEffect, removeEffect, addEffect, updateTimeLeft, removeEffectOnScreen, addEffectOnScreen, updateTimeLeftOnScreen, resetEffects } = effectsSlice.actions;

export default effectsSlice.reducer;
