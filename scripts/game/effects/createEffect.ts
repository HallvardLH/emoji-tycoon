import { Dimensions } from "react-native";
import { effectData } from "./effectData";
import { howFun } from "../shorthands";
import { Effect } from "./effectType";
import { HEADER_HEIGHT, TAB_BAR_HEIGHT } from "../../../components/layout/ScreenView";

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

    return "tap"; // Fallback
}

/**
 * Creates an effect
 *
 * Selects an effect from a pool of different effects, gotten from effectData
 *
 */
export function createEffect() {
    const margin = 150;

    // Generate random positions with a margin
    const xPos = Math.floor(Math.random() * (Dimensions.get("window").width - margin));
    // Ensure effects do not spawn off-screen
    const yPos = Math.random() * (Dimensions.get("window").height - (HEADER_HEIGHT + TAB_BAR_HEIGHT + margin));

    let chosenEffect;

    do {
        // Pick effect type based on weights
        const chosenEffectType = pickEffectType();

        // Filter effect data by chosen effect type
        const filteredEffects = effectData.filter(effect => effect.type === chosenEffectType);
        chosenEffect = filteredEffects[Math.floor(Math.random() * filteredEffects.length)];

        // If fun value is 17, effect 101 ("x77 emoji production") may be chosen
        if (chosenEffect.id === 101 && howFun(17)) {
            // 5% chance to accept this effect
            const randomChance = Math.random();
            if (randomChance <= 0.05) {
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
        margin: margin,
        type: chosenEffect.type
    }

    return effect;
}
