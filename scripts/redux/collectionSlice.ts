import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CollectionEmoji = {
    category?: string,
    emoji?: string,
    amount: number,
    rarity: number,
}

export interface CollectionState {
    faces: CollectionEmoji[],
    symbols: CollectionEmoji[],
    people: CollectionEmoji[],
    animals: CollectionEmoji[],
    food: CollectionEmoji[],
    bodyParts: CollectionEmoji[],
    objects: CollectionEmoji[],
    placesBuildings: CollectionEmoji[],
    plants: CollectionEmoji[],
    vehicles: CollectionEmoji[],
    weather: CollectionEmoji[],
}

const initialState: CollectionState = {
    faces: [],
    symbols: [],
    people: [],
    animals: [],
    food: [],
    bodyParts: [],
    objects: [],
    placesBuildings: [],
    plants: [],
    vehicles: [],
    weather: [],
};

interface AddToCollectionPayload {
    category: keyof CollectionState;
    id: number;
}

export const effectsSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {
        addToCollection: (state, action: PayloadAction<AddToCollectionPayload>) => {
            const { category, id } = action.payload;

            // Ensure the index exists in the array
            if (!state[category][id]) {
                // Create a new object at the index if it doesn't exist
                state[category][id] = { amount: 0, rarity: 0 };
            }

            // Increment the amount for the specified emoji
            state[category][id].amount += 1;
        },

        resetCollection: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

export const {
    addToCollection,
    resetCollection
} = effectsSlice.actions;

export default effectsSlice.reducer;