import { drawingHandUpgrades } from "./buildings/drawingHand";
import { graphicDesignStudioUpgrades } from "./buildings/graphicDesignStudio";
import { farmUpgrades } from "./buildings/farm";
import { restaurantUpgrades } from "./buildings/restaurant";
import { pettingZooUpgrades } from "./buildings/pettingZoo";
import { factoryUpgrades } from "./buildings/factory";
import { sportsCenterUpgrades } from "./buildings/sportsCenter";
import { bankUpgrades } from "./buildings/bank";
import { emojiThemeParkUpgrades } from "./buildings/emojiThemePark";
import { emojiAssemblyUpgrades } from "./buildings/emojiAssembly";
import { flyingSaucerUpgrades } from "./buildings/flyingSaucer";
import { bigEmojiUpgrades } from "./nonBuilding/bigEmoji";

import { UpgradeType } from "./UpgradeType";

export const upgradeData: UpgradeType[] = [
    ...drawingHandUpgrades,
    ...graphicDesignStudioUpgrades,
    ...farmUpgrades,
    ...restaurantUpgrades,
    ...pettingZooUpgrades,
    ...factoryUpgrades,
    ...sportsCenterUpgrades,
    ...bankUpgrades,
    ...emojiThemeParkUpgrades,
    ...emojiAssemblyUpgrades,
    ...flyingSaucerUpgrades,
    ...bigEmojiUpgrades
];