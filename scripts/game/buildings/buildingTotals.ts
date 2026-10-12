import store from "../../redux/reduxStore";
import { addBuildingEmojis } from "../../redux/statsSlice";

/**
 * Credits production to the buildings that made it, for the totals in Stats
 *
 * All production comes from buildings: their own output times every buff (upgrades,
 * production percentages, essence and perks, active effects). So each building gets
 * the share of it that its own output is of all buildings' output.
 *
 * @param produced emojis produced, with every buff counted
 */
export function creditBuildings(produced: number) {
    if (produced <= 0) return;
    const { buildings: { buildings }, values: { totalBuildingEps } } = store.getState();
    if (totalBuildingEps <= 0) return;

    const shares: Record<number, number> = {};
    for (const building of buildings) {
        if (building.eps > 0) shares[building.buildingId] = produced * building.eps / totalBuildingEps;
    }
    store.dispatch(addBuildingEmojis(shares));
}
