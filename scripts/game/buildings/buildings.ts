import { store } from '../../redux/reduxStore';
import { updateEps, updateEmojis } from '../../redux/valuesSlice';
import { buildingData } from './buildingData';
import { getBuilding } from '../shorthands';
import { unlockUpgrades } from '../upgrades/checks';
import { updateBuildingValue } from './shorthands';
import { canBuyBuilding } from './checks';

type PluralNames = {
    [key: string]: string;
}
export const pluralNames: PluralNames = {
    "Drawing hand": "Drawing hands",
    "Graphic design studio": "Graphic design studios",
    "Farm": "Farms",
    "Kitchen": "Kitchens",
    "Factory": "Factories",
    "Bank": "Banks",
    "Emoji assembly": "Emoji assemblies",
    "Flying saucer": "Flying saucers",
}

/**
 * Buys a building, subtracting the price from the player's emojis
 *
 * Description. (use period)
 *
 * @param buildingName the name of the building.
 * @param incrementBy the amount of buildings that will be bought (default is 1).
 */
export const buyBuilding = (buildingName: string, incrementBy: number = 1) => {
    const building = getBuilding(buildingName);
    const data = buildingData[building.buildingId];
    const currentAmount = building.amount;
    // Check if the building and its amount property exists
    if (currentAmount !== undefined) {
        const emojis = store.getState().values.emojis;
        // Check if new building can be afforded
        if (emojis >= building.price) {

            // Subtract the cost form emojis
            store.dispatch(updateEmojis(emojis - building.price));

            // Calculate new building amount
            const newAmount = currentAmount + incrementBy;
            updateBuildingValue(buildingName, "amount", newAmount);

            // Increase building price
            const price = Math.round(data.basePrice * Math.pow(1.125, newAmount));
            updateBuildingValue(buildingName, "price", price);

            // Recalculate eps
            calculateBuildingsEps();

            // This function is reguarly run at an interval, but running it immediatley eliminates potential lag in updating the front end
            // Determines if buy button should be visually disabled or enabled
            canBuyBuilding();

            // Check if upgrades should be unlocked
            unlockUpgrades();
        }
    } else {
        console.error("Building not found or 'amount' is undefined");
    }
};


export const calculateBuildingsEps = () => {
    const buildings = store.getState().buildings.buildings;
    let totalEps = 0;
    Object.keys(buildings).forEach(buildingName => {
        const building = buildings[buildingName];
        const baseEps = buildingData[building.buildingId].baseEps;

        const eps = (baseEps * building.amount) * Math.pow(2, building.upgrades);

        totalEps += eps;

        updateBuildingValue(buildingName, "eps", eps);
    });

    store.dispatch(updateEps(totalEps));
};


