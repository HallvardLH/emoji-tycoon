import { upgradeData } from "./upgradeData/upgradeData";

export function getUpgradeDataById(id: number) {
    return upgradeData.find(upgrade => upgrade.id === id)!;
}