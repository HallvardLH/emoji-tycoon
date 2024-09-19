import { store } from '../../redux/reduxStore';
import { updateTotalBuildingEps, updateEmojis } from '../../redux/valuesSlice';
import { buildingData } from './buildingData';
import { getBuilding, getBuildingById } from './shorthands';
import { unlockUpgrades } from '../upgrades/checks';
import { updateBuildingValue } from './shorthands';
import { canBuyBuilding } from './checks';
import { calculateEmojisPerSecond } from '../calculations';

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
    "Bank": "Banks",
    "Emoji theme park": "Emoji theme parks",
    "Emoji assembly": "Emoji assemblies",
    "Flying saucer": "Flying saucers",
}

type buildingName = {
    [key: string]: string;
}
export const buildingEmojis: buildingName = {
    "Drawing hand": "✍️",
    "Graphic design studio": "🎨",
    "Farm": "🌽",
    "Restaurant": "🍽️",
    "Petting zoo": "🦒",
    "Factory": "🏭",
    "Bank": "🏦",
    "Emoji theme park": "🎢",
    "Emoji assembly": "🏛️",
    "Flying saucer": "🛸",
}

/**
 * Buys a building, subtracting the price from the player's emojis.
 *
 * @param buildingId the ID of the building.
 * @param buyAmount the amount of buildings that will be bought (default is 1).
 */
export const buyBuilding = (buildingId: number, buyAmount: number = store.getState().preferences.bulkBuy) => {
    const building = getBuildingById(buildingId);
    const data = buildingData[building.buildingId];
    let currentAmount = building.amount;

    // Check if the building and its amount property exists
    if (currentAmount !== undefined) {
        let emojis = store.getState().values.emojis;

        // Loop through the number of buildings to buy
        for (let i = 0; i < buyAmount; i++) {

            // Check if the current building can be afforded
            if (emojis >= building.price) {

                // Subtract the cost from emojis
                store.dispatch(updateEmojis(emojis - building.price));

                // Increase the building amount
                currentAmount += 1;
                updateBuildingValue(buildingId, "amount", currentAmount);

                // Increase the building price for the next one
                const newPrice = Math.round(data.basePrice * Math.pow(1.125, currentAmount));
                updateBuildingValue(buildingId, "price", newPrice);

                // Update the emojis variable to the latest state
                emojis = store.getState().values.emojis;

            } else {
                break; // Stop if the player can't afford the next building
            }
        }
    } else {
        console.error("Building not found or 'amount' is undefined");
    }

    // Recalculate eps after buying buildings
    calculateBuildingsEps();

    // Run this immediately to update the front end
    canBuyBuilding();

    // Check if any upgrades should be unlocked after the purchase
    unlockUpgrades();
};



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

