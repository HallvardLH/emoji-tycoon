import { store } from "../redux/reduxStore";

// Get building from store shorthand
export function getBuilding(name: string) {
    return store.getState().buildings.buildings[name];
}