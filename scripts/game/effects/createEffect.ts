import { Dimensions } from "react-native";
import { effectData } from "./effectData";
import { howFun } from "../shorthands";
import { Effect } from "./effectType";

interface EffectWeights {
    [key: string]: number;
}

const effectWeights: EffectWeights = {
    tap: 50,
    production: 50,
};

// Function to pick an effect type based on weights
function pickEffectType(): string {
    const totalWeight = Object.values(effectWeights).reduce((acc, weight) => acc + weight, 0);
    const randomWeight = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const [effectType, weight] of Object.entries(effectWeights)) {
        cumulativeWeight += weight;
        if (randomWeight <= cumulativeWeight) {
            return effectType;
        }
    }

    return "tap"; // Fallback (optional)
}

/**
 * Creates an effect
 *
 * Selects an effect from a pool of different effects, gotten from effectData
 *
 */
export function createEffect() {
    const margin = 0;

    // Generate random positions with a margin
    // const xPos = Math.random() * (Dimensions.get("window").width - 2 * margin) + margin;
    // const yPos = Math.random() * (Dimensions.get("window").height - 2 * margin) + margin;
    const xPos = 100
    const yPos = 100

    let chosenEffect;

    do {
        // Pick effect type based on weights
        const chosenEffectType = pickEffectType();

        // Filter effect data by chosen effect type
        const filteredEffects = effectData.filter(effect => effect.type === chosenEffectType);
        chosenEffect = filteredEffects[Math.floor(Math.random() * filteredEffects.length)];

        if (chosenEffect.id === 101 && howFun(17)) {
            // 5% chance to accept this effect
            const randomChance = Math.random();
            console.log("Tried to give fun effect, and chance was: ", randomChance, " did it work?")
            if (randomChance <= 0.05) {
                console.log("It did!")
                break;
            }
        }

    } while (chosenEffect.id === 101);

    const effect: Effect = {
        title: chosenEffect.title,
        description: chosenEffect.description,
        emoji: chosenEffect.emoji,
        eptMult: chosenEffect.eptMult,
        eptAdd: chosenEffect.eptAdd,
        epsMult: chosenEffect.epsMult,
        timeLeft: chosenEffect.timeLeft,
        originalDuration: chosenEffect.timeLeft,
        timeLeftOnScreen: chosenEffect.timeLeftOnScreen,
        instanceId: Date.now(),
        id: chosenEffect.id,
        xPos: xPos,
        yPos: yPos,
        type: chosenEffect.type
    }

    return effect;
}
