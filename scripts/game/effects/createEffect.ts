import { Dimensions } from "react-native";
import { effectData } from "./effectData";

export type EffectTypes = "tap";

export interface Effect {
    title: string;
    description: string;
    emoji: string;
    eptMult: number;
    eptAdd: number;
    timeLeft: number;
    timeLeftOnScreen: number;
    id: number;
    xPos: number;
    yPos: number;
    type: EffectTypes;
}

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
    const xPos = Math.random() * (Dimensions.get("window").width - 2 * margin) + margin;
    const yPos = Math.random() * (Dimensions.get("window").height - 2 * margin) + margin;

    const effect: Effect = {
        title: effectData[0].title,
        description: effectData[0].description,
        emoji: effectData[0].emoji,
        eptMult: effectData[0].eptMult ? effectData[0].eptMult : 0,
        eptAdd: effectData[0].eptAdd ? effectData[0].eptAdd : 0,
        timeLeft: effectData[0].timeLeft,
        timeLeftOnScreen: effectData[0].timeLeftOnScreen,
        id: Date.now(),
        xPos: xPos,
        yPos: yPos,
        type: effectData[0].type
    }

    return effect
}