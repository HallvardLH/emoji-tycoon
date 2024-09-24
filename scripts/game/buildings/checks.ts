import { store } from '../../redux/reduxStore';
import { updateBuildingValue } from './shorthands';
import { unlockedBuildingNotificaiton } from '../../redux/buildingsSlice';

/**
 * Checks if the player can afford each building
 *
 * Is called form the gameLoop module every 2.5 seconds, but ought to be called immediately upon buying a building
 *
 */
export const canBuyBuilding = () => {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;
    buildings.forEach(building => {
        updateBuildingValue(building.buildingId, "canBuy", emojis >= buildings[building.buildingId].price);
    });
}

/**
 * Checks if a building should be unlocked
 *
 * Is called from the gameLoop module every 2.5 seconds
 */
export function unlockBuilding() {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;

    buildings.forEach(building => {
        // Check if the building is locked and if the player has enough emojis to unlock it
        if (!building.unlocked && emojis >= building.price / 10) {
            updateBuildingValue(building.buildingId, "unlocked", true);
            store.dispatch(unlockedBuildingNotificaiton());
        }
    });
}