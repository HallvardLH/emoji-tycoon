import store from '../../redux/reduxStore';
import { updateBuilding, BuildingProps } from '../../redux/buildingsSlice';
import { buildingData } from './buildingData';
import { BuildingNames } from './buildingNamesType';

/**
 * Shorthand for updating a buildings properties in Redux
 *
 * Is called form the gameLoop module every 2.5 seconds, but ought to be called immediately upon buying a building
 *
 * @param buildingName the name of the building.
 * @param key the key which is to be updated, buildings are stored as objects in Redux.
 * @param value the new value of the object's key.
 */
export const updateBuildingValue = (buildingId: number, key: keyof BuildingProps, value: number | boolean) => {
    const building = getBuildingById(buildingId);

    // Check if the building exists
    if (building) {
        // Dispatch an action to update the specified property with the new value
        store.dispatch(updateBuilding({
            buildingId: buildingId,
            key: key,
            value: value
        }));
    } else {
        console.error("Building not found");
    }
};

// Get building from store by name
export function getBuilding(name: string) {
    const buildings = store.getState().buildings.buildings;
    return buildings.find(building => buildingData[building.buildingId].name === name)!;
}

/**
 * Get building from store by ID
 * @param buildingId The ID of the building to retrieve.
 * @returns The building from the Redux store or undefined if not found.
 */
export function getBuildingById(buildingId: number) {
    const buildings = store.getState().buildings.buildings;
    return buildings.find(building => building.buildingId === buildingId)!;
}

/**
 * Gets the buildingId from the building name.
 * 
 * Useful when you know the id but not the name. It can happen!
 *
 * @param name The name of the building.
 * @returns The buildingId.
 */
export function getBuildingIdFromName(name: BuildingNames): number {
    if (name === "Big emoji") {
        return 0
    }
    const building = buildingData.find(building => building.name === name)!;
    return building.buildingId

}