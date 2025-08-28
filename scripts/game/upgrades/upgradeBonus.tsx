
import store from '../../redux/reduxStore';
import { getBuilding } from "../buildings/shorthands";
import { formatNumber } from "../../misc";
import { getUpgradeDataById } from './shorthands';
import { calculateEpsBonus, calculateEptBonus } from '../calculations';
import React from 'react';
import Text from '../../../components/generalUI/Text';
import { colors } from '../../../components/misc/Colors';

export function getUpgradeBonus(upgradeId: number) {
    const upgrade = getUpgradeDataById(upgradeId);
    const currentEps = store.getState().values.emojisPerSecond;
    let bonuses: string[] = [];
    let bonusPercentages: string[] = [];
    let suffixes: string[] = [];
    upgrade.categories.forEach((category) => {
        let bonus = 0
        switch (category) {
            case "Multiply building production": {
                const building = getBuilding(upgrade.building!);
                bonus = (building.eps * upgrade.emojisPerSecondMultiplier!) - building.eps;
                bonuses.push(formatNumber(bonus));

                const bonusPercentage = (bonus / currentEps) * 100;
                if (bonusPercentage < 0.01) {
                    bonusPercentages.push("(>0.01%)");
                } else {
                    bonusPercentages.push("(" + bonusPercentage.toFixed(2) + "%)");
                }
                suffixes.push("Emojis per second, increasing emoji production by");

                <React.Fragment>
                    <Text shadow={false} color={colors.purple.dark} size={14}>
                        <Text shadow={false} color={"gray"} size={14}>+{bonus}</Text> {suffixes[index]} <Text shadow={false} color={"gray"} size={14}>{bonusPercentages[index]}</Text>
                    </Text>
                </React.Fragment>


                break
            }
            case "Multiply tap": {
                const calculatedBonus = calculateEptBonus(undefined, upgrade.emojisPerTapMultiplier);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                suffixes.push("ept");
                break
            }
            case "Percentage increase tap": {
                const calculatedBonus = calculateEptBonus(undefined, undefined, upgrade.emojisPerTapPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                suffixes.push("ept");
                break
            }
            case 'Tap percentage of eps': {
                const calculatedBonus = calculateEptBonus(upgrade.emojisPerTapPercentageOfEps);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                suffixes.push("ept");
                break
            }
            case "Percentage increase production": {
                const calculatedBonus = calculateEpsBonus(undefined, upgrade.emojisPerSecondPercentageIncrease);
                bonuses.push(calculatedBonus.bonus);
                bonusPercentages.push(calculatedBonus.bonusPercentage);
                suffixes.push("eps");
                break
            }
            default:

        }
    })

    return [bonuses, bonusPercentages, suffixes]
}