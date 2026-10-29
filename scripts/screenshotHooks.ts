import { Platform } from "react-native";
import { SCREENSHOT_MODE } from "./screenshotMode";
import store from "./redux/reduxStore";
import { giveOneOffEmojis } from "./game/giveEmojis";
import { setGameSpeed } from "./game/gameSpeed";
import { spawnEffect, spawnEffects } from "./game/effects/onScreenEffects";
import { setAlwaysShiny } from "./game/bigEmoji";
import { cheatCollectEmojis } from "./game/cheats";

/**
 * Screenshot mode on the web: the cheats on `window.screenshot`, so a recording script
 * (brag-output) can stage moments without opening the cheats on camera
 */
if (SCREENSHOT_MODE && Platform.OS === "web") {
    (window as any).screenshot = { store, giveOneOffEmojis, setGameSpeed, spawnEffect, spawnEffects, setAlwaysShiny, cheatCollectEmojis };
}
