import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buildingData } from '../data/buildingData';

export interface BuildingProps {
    buildingId: number;
    amount: number;
    price: number;
    eps: number;
    upgrades: any[]; // For now
}

interface ValuesState {
    emojis: number;
    bigEmoji: string;
    eps: number;
    buildings: Record<string, BuildingProps>;
}

const initialState: ValuesState = {
    emojis: 1000,
    bigEmoji: "😀",
    eps: 0,
    buildings: {
        "Drawing hand": {
            buildingId: 0,
            amount: 0,
            price: buildingData[0].basePrice,
            eps: buildingData[0].baseEps,
            upgrades: [],
        },
        "Graphic design studio": {
            buildingId: 1,
            amount: 0,
            price: buildingData[1].basePrice,
            eps: buildingData[1].baseEps,
            upgrades: [],
        },
        "Kitchen": {
            buildingId: 2,
            amount: 0,
            price: buildingData[2].basePrice,
            eps: buildingData[2].baseEps,
            upgrades: [],
        },
    }
};

// Define the payload types for actions that require more than one value
interface UpdateBuildingPayload {
    buildingName: string;
    key: keyof BuildingProps; // Ensure that the key is a valid property of Building
    value: number | any[]; // The type of 'value' depends on what 'key' is. It could be a number or any[] based on your current structure
}

// Create the slice with reducers properly typed
export const valuesSlice = createSlice({
    name: "values",
    initialState,
    reducers: {
        updateEmojis: (state, action: PayloadAction<number>) => {
            state.emojis = action.payload;
        },
        updateBigEmoji: (state, action: PayloadAction<string>) => {
            state.bigEmoji = action.payload;
        },
        updateEps: (state, action: PayloadAction<number>) => {
            state.eps = action.payload;
        },
        updateBuilding: (state, action: PayloadAction<UpdateBuildingPayload>) => {
            const { buildingName, key, value } = action.payload;
            if (state.buildings[buildingName]) {
                // Use type assertion to reassure TypeScript about the assignment compatibility
                switch (key) {
                    case 'amount':
                    case 'buildingId':
                    case 'price':
                    case 'eps':
                        state.buildings[buildingName][key] = value as number;
                        break;
                    case 'upgrades':
                        state.buildings[buildingName][key] = value as any[];
                        break;
                    default:
                        console.warn(`Key '${key}' not recognized or not supported for direct updates.`);
                        break;
                }
            }
        },
        resetState: (state) => {
            // Directly return the initialState
            return initialState;
        },

    },
});

// Export the generated action creators
export const { updateEmojis, updateBigEmoji, updateEps, updateBuilding, resetState } = valuesSlice.actions;

export default valuesSlice.reducer;
