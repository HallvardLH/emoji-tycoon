import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buildingData } from '../data/buildingData';

export interface BuildingProps {
    buildingId: number;
    amount: number;
    canBuy: boolean;
    price: number;
    eps: number;
    upgrades: number;
}

interface ValuesState {
    buildings: Record<string, BuildingProps>;
}

const initialState: ValuesState = {
    buildings: {
        "Drawing hand": {
            buildingId: 0,
            amount: 0,
            canBuy: false,
            price: buildingData[0].basePrice,
            eps: buildingData[0].baseEps,
            upgrades: 0,
        },
        "Graphic design studio": {
            buildingId: 1,
            amount: 0,
            canBuy: false,
            price: buildingData[1].basePrice,
            eps: buildingData[1].baseEps,
            upgrades: 0,
        },
        "Farm": {
            buildingId: 2,
            amount: 0,
            canBuy: false,
            price: buildingData[2].basePrice,
            eps: buildingData[2].baseEps,
            upgrades: 0,
        },
        "Kitchen": {
            buildingId: 3,
            amount: 0,
            canBuy: false,
            price: buildingData[3].basePrice,
            eps: buildingData[3].baseEps,
            upgrades: 0,
        },
        "Factory": {
            buildingId: 4,
            amount: 0,
            canBuy: false,
            price: buildingData[4].basePrice,
            eps: buildingData[4].baseEps,
            upgrades: 0,
        },
        "Bank": {
            buildingId: 5,
            amount: 0,
            canBuy: false,
            price: buildingData[5].basePrice,
            eps: buildingData[5].baseEps,
            upgrades: 0,
        },
        "Emoji assembly": {
            buildingId: 6,
            amount: 0,
            canBuy: false,
            price: buildingData[6].basePrice,
            eps: buildingData[6].baseEps,
            upgrades: 0,
        },
        "Flying saucer": {
            buildingId: 7,
            amount: 0,
            canBuy: false,
            price: buildingData[7].basePrice,
            eps: buildingData[7].baseEps,
            upgrades: 0,
        },
    }
};

// Define the payload types for actions that require more than one value
interface UpdateBuildingPayload {
    buildingName: string;
    key: keyof BuildingProps; // Ensure that the key is a valid property of Building
    value: number | boolean | any[];
}

export const buildingsSlice = createSlice({
    name: "buildings",
    initialState,
    reducers: {
        updateBuilding: (state, action: PayloadAction<UpdateBuildingPayload>) => {
            const { buildingName, key, value } = action.payload;
            if (state.buildings[buildingName]) {
                switch (key) {
                    case 'amount':
                    case 'price':
                    case 'eps':
                        state.buildings[buildingName][key] = value as number;
                        break;
                    case 'canBuy':
                        state.buildings[buildingName][key] = value as boolean;
                        break;
                    case 'upgrades':
                        state.buildings[buildingName][key] = value as number;
                        break;
                    default:
                        console.warn(`Key '${key}' not recognized or not supported for direct updates.`);
                        break;
                }
            }
        },
        resetBuildings: (state) => {
            return initialState;
        },
    },
});

export const { updateBuilding, resetBuildings } = buildingsSlice.actions;

export default buildingsSlice.reducer;