import { store } from '../../redux/reduxStore';
import { updateBuildingValue } from './shorthands';

/**
 * Checks if the player can afford each building
 *
 * Is called form the gameLoop module every 2.5 seconds, but ought to be called immediately upon buying a building
 *
 */
export const canBuyBuilding = () => {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;
    Object.keys(buildings).forEach(buildingName => {
        updateBuildingValue(buildingName, "canBuy", emojis >= buildings[buildingName].price);
    });
}

/**
 * Checks if a building should be unlocked
 *
 * Is called form the gameLoop module every 2.5 seconds
 *
 */
export function unlockBuilding() {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;
    for (const building in buildings) {
        if (emojis >= buildings[building].price / 10) {
            updateBuildingValue(building, "unlocked", true)
        }
    }
}