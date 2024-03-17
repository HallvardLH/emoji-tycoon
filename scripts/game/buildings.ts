import { store } from '../redux/reduxStore';
import { updateBuilding, BuildingProps, updateEps, updateEmojis } from '../redux/valuesSlice';
import { buildingData } from '../data/buildingData';

// Get building from store shorthand
function getBuilding(name: string) {
    return store.getState().values.buildings[name];
}

// A generic function to update properties of a building in the local state
export const updateBuildingValue = (buildingName: string, key: keyof BuildingProps, value: number) => {
    const buildings = store.getState().values.buildings;

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
            const price = Math.round(data.basePrice * Math.pow(1.2, newAmount));
            updateBuildingValue(buildingName, "price", price);

            // Recalculate eps
            calculateBuildingsEps();
        }
    } else {
        console.error("Building not found or 'amount' is undefined");
    }
};


export const calculateBuildingsEps = () => {
    const buildings = store.getState().values.buildings;
    let totalEps = 0;
    Object.keys(buildings).forEach(buildingName => {
        const building = buildings[buildingName];
        const baseEps = buildingData[building.buildingId].baseEps;

        const eps = baseEps * building.amount;

        totalEps += eps;

        updateBuildingValue(buildingName, "eps", eps);
    });

    store.dispatch(updateEps(totalEps));
};
