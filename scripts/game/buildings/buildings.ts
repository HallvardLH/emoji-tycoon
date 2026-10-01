import store from '../../redux/reduxStore';
import { updateTotalBuildingEps, updateEmojis } from '../../redux/valuesSlice';
import { buildingData, BUILDING_PRICE_GROWTH } from './buildingData';
import { getBuildingById } from './shorthands';
import { unlockUpgrades } from '../upgrades/checks';
import { updateBuildingValue } from './shorthands';
import { canBuyBuilding } from './checks';
import { calculateEmojisPerSecond, calculateEpt } from '../calculations';
import * as Haptics from "expo-haptics"
import { BulkBuyAmount } from '../../redux/preferencesSlice';
import { celebrateMilestone } from '../milestones';
import { buildingPriceMultiplier } from '../prestige/perks';

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


const PRICE_GROWTH = BUILDING_PRICE_GROWTH;

/** What the building costs when you own `amount` of it, with any Bulk discount (perk) */
export function unitPrice(buildingId: number, amount: number) {
    return Math.round(buildingData[buildingId].basePrice * Math.pow(PRICE_GROWTH, amount) * buildingPriceMultiplier());
}

/**
 * Turns a bulk buy setting into a number of buildings.
 *
 * "max" is as many as the bank can afford (at least 1, so a price can still be shown).
 * The closed form of the geometric price series gives a first guess; it uses unrounded
 * prices, so it's adjusted until the real (rounded) total fits and one more wouldn't.
 *
 * @param emojis the bank to fit "max" into; pass the same number the price is compared against
 */
export function resolveBuyAmount(
    buildingId: number,
    bulkBuy: BulkBuyAmount = store.getState().preferences.bulkBuy,
    emojis: number = store.getState().values.emojis,
): number {
    if (bulkBuy !== "max") return bulkBuy;

    const owned = getBuildingById(buildingId).amount;
    const nextPrice = unitPrice(buildingId, owned);

    let count = Math.max(1, Math.floor(Math.log(emojis * (PRICE_GROWTH - 1) / nextPrice + 1) / Math.log(PRICE_GROWTH)));
    let total = 0;
    for (let i = 0; i < count; i++) total += unitPrice(buildingId, owned + i);
    while (count > 1 && total > emojis) {
        count--;
        total -= unitPrice(buildingId, owned + count);
    }
    while (total + unitPrice(buildingId, owned + count) <= emojis) {
        total += unitPrice(buildingId, owned + count);
        count++;
    }
    return count;
}

/**
 * Buys a building, subtracting the price from bank.
 *
 * @param buildingId the ID of the building.
 * @param bulkBuy the amount of buildings that will be bought (defaults to the bulk buy preference).
 */
export const buyBuilding = (buildingId: number, bulkBuy: BulkBuyAmount = store.getState().preferences.bulkBuy) => {
    const state = store.getState();
    const buyAmount = resolveBuyAmount(buildingId, bulkBuy);
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
        const price = unitPrice(data.buildingId, currentAmount + i);
        totalCost += price;
    }

    // Single state update for emojis
    if (totalCost > 0) {
        store.dispatch(updateEmojis(emojis - totalCost));
    }

    const newAmount = currentAmount + actualBuyAmount;
    const newPrice = unitPrice(data.buildingId, newAmount);

    updateBuildingValue(buildingId, "amount", newAmount);
    updateBuildingValue(buildingId, "price", newPrice);

    // Trigger haptic feedback if buildings were bought
    if (actualBuyAmount > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (currentAmount === 0) {
        celebrateMilestone({ icon: data.icon, caption: "NEW BUILDING", title: `Your first ${data.name.charAt(0).toLowerCase()}${data.name.slice(1)}!` });
    }

    batchRecalculations();
};

/**
 * Recomputes every building's stored price from its base price, so saves pick up
 * base price changes (e.g. the black hole and singularity getting cheaper)
 *
 * Called once at game start
 */
export function syncBuildingPrices() {
    store.getState().buildings.buildings.forEach(building => {
        const price = unitPrice(building.buildingId, building.amount);
        if (building.price !== price) updateBuildingValue(building.buildingId, "price", price);
    });
}

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
        const nextPrice = unitPrice(data.buildingId, currentAmount + i);

        if (cumulativeCost + nextPrice <= currentEmojis) {
            cumulativeCost += nextPrice;
            affordable++;
        } else {
            break;
        }
    }

    return affordable;
};


/**
 * The total price of the next bulk buy
 *
 * @param emojis the bank "max" is fitted into (defaults to the live bank)
 */
export function calculateBuildingPrice(
    buildingId: number,
    bulkBuy: BulkBuyAmount = store.getState().preferences.bulkBuy,
    emojis: number = store.getState().values.emojis,
) {
    const buyAmount = resolveBuyAmount(buildingId, bulkBuy, emojis);
    const building = getBuildingById(buildingId);
    const data = buildingData[building.buildingId];
    let currentAmount = building.amount;
    let price = 0;

    // Loop through the number of buildings to buy
    for (let i = 0; i < buyAmount; i++) {
        // We make sure to update the building value with each iteration
        const currentBuilding = getBuildingById(buildingId);
        // Check if the current building can be afforded
        price += unitPrice(data.buildingId, currentAmount);
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

