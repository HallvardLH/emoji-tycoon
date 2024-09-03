import { Dimensions } from "react-native";
import { effectData } from "./effectData";
import { Effect } from "./effectType";

/**
 * Creates an effect
 *
 * Selects an effect from a pool of different effects, gotten from effectData
 *
 */
export function createEffect() {

    // A margin to avoid extreme values close to the edges
    const margin = 0;

    // Generate random positions with a margin
    // TODO: Make this work properly
    const xPos = Math.random() * (Dimensions.get("window").width - 2 * margin) + margin;
    const yPos = Math.random() * (Dimensions.get("window").height - 2 * margin) + margin;

    // const chosenEffect = effectData[Math.floor(Math.random() * 3)];
    const chosenEffect = effectData[2];
    const effect: Effect = {
        title: chosenEffect.title,
        description: chosenEffect.description,
        emoji: chosenEffect.emoji,
        eptMult: chosenEffect.eptMult,
        eptAdd: chosenEffect.eptAdd,
        epsMult: chosenEffect.epsMult,
        timeLeft: chosenEffect.timeLeft,
        timeLeftOnScreen: chosenEffect.timeLeftOnScreen,
        id: Date.now(),
        xPos: xPos,
        yPos: yPos,
        type: chosenEffect.type
    }

    return effect
}