import { store } from '../../redux/reduxStore';
import { updateBuilding, BuildingProps } from '../../redux/buildingsSlice';

/**
 * Shorthand for updating a buildings properties in Redux
 *
 * Is called form the gameLoop module every 2.5 seconds, but ought to be called immediately upon buying a building
 *
 * @param buildingName the name of the building.
 * @param key the key which is to be updated, buildings are stored as objects in Redux.
 * @param value the new value of the object's key.
 */
export const updateBuildingValue = (buildingName: string, key: keyof BuildingProps, value: number | boolean) => {
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