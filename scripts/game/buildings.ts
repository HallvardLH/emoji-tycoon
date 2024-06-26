import { store } from '../redux/reduxStore';
import { updateBuilding, BuildingProps } from '../redux/buildingsSlice';
import { updateEps, updateEmojis } from '../redux/valuesSlice';
import { buildingData } from '../data/buildingData';
import { getBuilding } from './shorthands';
import { unlockUpgrades } from './checks';

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

// A generic function to update properties of a building in the local state
export const updateBuildingValue = (buildingName: string, key: keyof BuildingProps, value: number) => {
    const buildings = store.getState().buildings.buildings;

    // Check if the building exists
    if (buildings[buildingName]) {
        // Dispatch an action to update the specified property with the new value
        store.dispatch(updateBuilding({
            buildingName: buildingName,
            key: key,
            value: value
        }));
    } else {
        console.error("Building not found");
    }
};

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

            // Update buy button right away
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

export const canBuyBuilding = () => {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;
    Object.keys(buildings).forEach(buildingName => {
        updateBuildingValue(buildingName, "canBuy", emojis >= buildings[buildingName].price);
    });
}
