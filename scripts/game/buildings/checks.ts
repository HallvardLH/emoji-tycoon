import store from '../../redux/reduxStore';
import { updateBuildingValue } from './shorthands';
import { unlockedBuildingNotificaiton } from '../../redux/buildingsSlice';

/**
 * Checks if the player can afford each building
 *
 * Is called form the gameLoop every 2.5 seconds, but ought to be called immediately upon buying a building
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
 * Is called from the gameLoop every 2.5 seconds
 */
export function unlockBuilding() {
    const buildings = store.getState().buildings.buildings;
    const emojis = store.getState().values.emojis;

    buildings.forEach(building => {
        // Check if the building is locked and if the player has enough emojis to unlock it
        if (!building.unlocked && emojis >= building.price / 4) {
            updateBuildingValue(building.buildingId, "unlocked", true);
            // Don't show notification if the player is on the buildings tab
            const activeTab = store.getState().tabs.activeTab;
            // TODO: update this for new navigation
            if (activeTab !== "Shop") {
                store.dispatch(unlockedBuildingNotificaiton());
            }
        }
    });
}