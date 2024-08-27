import { store } from "../redux/reduxStore";
import { getBuilding } from "./shorthands";
import { buildingUpgrades } from "../data/upgradeData";
import { unlockUpgrade } from "../redux/upgradesSlice";
import { updateEmojisPerTap } from "../redux/bigEmojiSlice";

type UnlockReq = {
    [key: number]: number;
}

const unlockReq: UnlockReq = {
    0: 1,
    1: 10,
    2: 50,
    3: 100,
    4: 200,
    // 0: 1,
    // 1: 2,
    // 2: 3,
    // 3: 4,
    // 4: 5,
}

// Unlocks upgrades if the requirements are met
export function unlockUpgrades() {
    let i = 0;
    for (const upgrade of buildingUpgrades) {
        const building = getBuilding(upgrade.building)
        if (building.amount >= unlockReq[upgrade.tier]) {
            store.dispatch(unlockUpgrade(i))
        }
        i++;
    }
}

// Recalculates emojis per tap
export function calculateEpt() {
    // Base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;
    // Adds emojis to base per tap
    const emojisPerTapAdd = store.getState().bigEmoji.eptAdd;
    // Multiplies emojis per tap
    let emojisPerTapMultiplier = store.getState().bigEmoji.eptMult;
    if (emojisPerTapMultiplier == 0) { emojisPerTapMultiplier = 1 }

    let ept = (baseEmojisPerTap + emojisPerTapAdd) * emojisPerTapMultiplier

    store.dispatch(updateEmojisPerTap(ept));
}