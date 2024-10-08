import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buildingData } from '../game/buildings/buildingData';

export interface BuildingProps {
    buildingId: number;
    name: string;
    icon: string;
    amount: number;
    canBuy: boolean;
    price: number;
    eps: number;
    epsMultipliers: number[];
    upgrades: number;
    unlocked: boolean;
    unlockedHelpers: boolean;
}

interface BuildingsState {
    buildings: BuildingProps[];
    unlockedBuildingsNotification: number;
}

const initialState: BuildingsState = {
    buildings: buildingData.map((building, index) => ({
        buildingId: building.buildingId,
        name: building.name,
        icon: building.icon,
        amount: 0,
        canBuy: false,
        price: building.basePrice,
        eps: 0,
        epsMultipliers: [],
        upgrades: 0,
        unlocked: false,
        unlockedHelpers: false,
    })),
    unlockedBuildingsNotification: 0,
};

// Define the payload types for actions that require more than one value
interface UpdateBuildingPayload {
    buildingId: number;
    key: keyof BuildingProps; // Ensure that the key is a valid property of BuildingProps
    value: number | boolean | any[];
}

export const buildingsSlice = createSlice({
    name: "buildings",
    initialState,
    reducers: {
        updateBuilding: (state, action: PayloadAction<UpdateBuildingPayload>) => {
            const { buildingId, key, value } = action.payload;
            const building = state.buildings.find(b => b.buildingId === buildingId);

            if (building) {
                switch (key) {
                    case 'epsMultipliers':
                        building.epsMultipliers.push(value as number)
                        break
                    case 'amount':
                    case 'price':
                    case 'eps':
                    case 'upgrades':
                        building[key] = value as number;
                        break;
                    case 'canBuy':
                    case 'unlocked':
                    case 'unlockedHelpers':
                        building[key] = value as boolean;
                        break;
                    default:
                        console.warn(`Key '${key}' not recognized or not supported for direct updates.`);
                        break;
                }
            }
        },
        unlockedBuildingNotificaiton: (state) => {
            state.unlockedBuildingsNotification++;
        },
        clearUnlockedBuildingsNotifications: (state) => {
            state.unlockedBuildingsNotification = 0;
        },
        resetBuildings: (state) => {
            // Reset the entire buildings state to the initial state
            state.buildings = initialState.buildings.map(building => ({
                ...building,
                amount: 0, // Reset specific properties
                canBuy: false,
                upgrades: 0,
                unlocked: false, // Unlock only the first building
            }));
        },
    },
});

export const { updateBuilding, clearUnlockedBuildingsNotifications, unlockedBuildingNotificaiton, resetBuildings } = buildingsSlice.actions;

export default buildingsSlice.reducer;
