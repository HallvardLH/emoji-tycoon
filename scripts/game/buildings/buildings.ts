import store from '../../redux/reduxStore';
import { updateTotalBuildingEps, updateEmojis } from '../../redux/valuesSlice';
import { buildingData } from './buildingData';
import { getBuildingById } from './shorthands';
import { unlockUpgrades } from '../upgrades/checks';
import { updateBuildingValue } from './shorthands';
import { canBuyBuilding } from './checks';
import { calculateEmojisPerSecond, calculateEpt } from '../calculations';
import * as Haptics from "expo-haptics"

type PluralNames = {
    [key: string]: string;
}

export const pluralNames: PluralNames = {
    "Drawing hand": "Drawing hands",
    "Graphic design studio": "Graphic design studios",
    "Farm": "Farms",
    "Restaurant": "Restaurants",
    "Petting zoo": "Petting zoos",
    "Factory": "Factories",
    "Sports center": "Sports centers",
    "Bank": "Banks",
    "Emoji theme park": "Emoji theme parks",
    "Emoji assembly": "Emoji assemblies",
    "Space station": "Space stations",
    "Candy kingdom": "Candy kingdoms",
    "Emoji volcano": "Emoji volcanoes",
    "Temple of the Big Emoji in the sky": "Temples of the Big Emoji in the sky",
    "Emoji supercomputer": "Emoji supercomputers",
    "Emoji black hole": "Emoji black holes",
    "Emoji singularity": "Emoji singularities",
};

type buildingName = {
    [key: string]: string;
};

export const buildingEmojis: buildingName = {
    "Drawing hand": "✍️",
    "Graphic design studio": "🎨",
    "Farm": "🌽",
    "Restaurant": "🍽️",
    "Petting zoo": "🦒",
    "Factory": "🏭",
    "Sports center": "🏈",
    "Bank": "🏦",
    "Emoji theme park": "🎢",
    "Emoji assembly": "🏛️",
    "Space station": "🛰️",
    "Candy kingdom": "🍭",
    "Emoji volcano": "🌋",
    "Temple of the Big Emoji in the sky": "🏯",
    "Emoji supercomputer": "🖥️",
    "Emoji black hole": "🕳️",
    "Emoji singularity": "⚛️",
};


/**
 * Buys a building, subtracting the price from bank.
 *
 * @param buildingId the ID of the building.
 * @param buyAmount the amount of buildings that will be bought (default is 1).
 */
export const buyBuilding = (buildingId: number, buyAmount: number = store.getState().preferences.bulkBuy) => {
    const state = store.getState();
    let building = getBuildingById(buildingId);

    if (!building || building.amount === undefined) {
        console.error("Building not found or 'amount' is undefined");
        return;
    }

    const data = buildingData[building.buildingId];
    let currentAmount = building.amount;
    let emojis = state.values.emojis;
    let totalCost = 0;

    // Pre-calculate how many buildings can be afforded
    const affordableBuildings = calculateAffordableBuildings(building, data, emojis, buyAmount);
    const actualBuyAmount = Math.min(buyAmount, affordableBuildings);

    if (actualBuyAmount === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }

    // Calculate total cost for all buildings at once
    for (let i = 0; i < actualBuyAmount; i++) {
        const price = Math.round(data.basePrice * Math.pow(1.175, currentAmount + i));
        totalCost += price;
    }

    // Single state update for emojis
    if (totalCost > 0) {
        store.dispatch(updateEmojis(emojis - totalCost));
    }

    const newAmount = currentAmount + actualBuyAmount;
    const newPrice = Math.round(data.basePrice * Math.pow(1.175, newAmount));

    updateBuildingValue(buildingId, "amount", newAmount);
    updateBuildingValue(buildingId, "price", newPrice);

    // Trigger haptic feedback if buildings were bought
    if (actualBuyAmount > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    batchRecalculations();
};

/**
 * Batching all expensive recalculations into a single function
 */
const batchRecalculations = () => {
    calculateBuildingsEps();
    canBuyBuilding();
    unlockUpgrades();
    calculateEpt();
};

const calculateAffordableBuildings = (building: any, data: any, currentEmojis: number, maxAmount: number) => {
    let affordable = 0;
    let cumulativeCost = 0;
    let currentAmount = building.amount;

    for (let i = 0; i < maxAmount; i++) {
        const nextPrice = Math.round(data.basePrice * Math.pow(1.175, currentAmount + i));

        if (cumulativeCost + nextPrice <= currentEmojis) {
            cumulativeCost += nextPrice;
            affordable++;
        } else {
            break;
        }
    }

    return affordable;
};


export function calculateBuildingPrice(buildingId: number, buyAmount: number = store.getState().preferences.bulkBuy) {
    const building = getBuildingById(buildingId);
    const data = buildingData[building.buildingId];
    let currentAmount = building.amount;
    let price = 0;

    // Loop through the number of buildings to buy
    for (let i = 0; i < buyAmount; i++) {
        // We make sure to update the building value with each iteration
        const currentBuilding = getBuildingById(buildingId);
        // Check if the current building can be afforded
        price += Math.round(data.basePrice * Math.pow(1.175, currentAmount));
        currentAmount += 1;
    }

    return price;
}



/**
 * Calculates the total EPS (Emojis Per Second) for all buildings.
 * 
 * Iterates through all buildings in the store, calculates the EPS based on the building's base EPS, 
 * amount, and multiplier, then updates each building's EPS value. Finally, dispatches the total EPS 
 * to the Redux store.
 *
 * Must be called whenever an upgrade or building is bought, or other actions that would affect EPS.
 */
export const calculateBuildingsEps = () => {
    const buildings = store.getState().buildings.buildings;
    let totalEps = 0;

    buildings.forEach(building => {
        const baseBuildingEps = buildingData[building.buildingId].baseEps;

        const totalMultiplier = building.epsMultipliers
            // Remove 0
            .filter(mult => mult !== 0)
            .reduce((acc, mult) => acc * mult, 1);

        // Calculate eps for the building, considering its multiplier and amount
        const eps = (baseBuildingEps * building.amount) * totalMultiplier;

        totalEps += eps;

        // Update the eps of the building
        updateBuildingValue(building.buildingId, "eps", eps);
    });

    // Dispatch the total eps to the store
    store.dispatch(updateTotalBuildingEps(totalEps));

    calculateEmojisPerSecond();
};

