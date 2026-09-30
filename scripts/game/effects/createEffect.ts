import { effectData } from "./effectData";
import { howFun } from "../shorthands";
import { Effect } from "./effectType";
import { getEmojisPerSecond } from "../shorthands";

interface EffectWeights {
    [key: string]: number;
}

const effectWeights: EffectWeights = {
    tap: 40,
    production: 40,
    give: 20
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

// Effects made in the same millisecond (e.g. a double spawn) still need unique ids
let instanceCounter = 0;
function nextInstanceId() {
    instanceCounter = (instanceCounter + 1) % 1000;
    return Date.now() * 1000 + instanceCounter;
}

/**
 * Creates an effect
 *
 * Selects an effect from a pool of different effects, gotten from effectData
 *
 */
export function createEffect() {
    // Positions are fractions (0 - 1) of the free space on the home screen.
    // EffectPopup turns them into pixels once it knows the real size of the
    // play area and of the effect itself, so an effect is never off screen.
    const xPos = Math.random();
    const yPos = Math.random();

    const eps = getEmojisPerSecond();

    let chosenEffect;

    do {
        // Pick effect type based on weights
        const chosenEffectType = pickEffectType();

        // Filter effect data by chosen effect type
        let filteredEffects = effectData.filter(effect => effect.type === chosenEffectType);

        // Disallow bad effects from being chosen if eps is below 1 million
        // This is mainly to avoid the player's very first boost being negative
        if (eps < 1_000_000) {
            filteredEffects = filteredEffects.filter(effect => effect.quality !== "bad");
        }

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

    // If fun value is 1 or 2, all effects emojis are replaced with cookie
    if (howFun(1, 2)) {
        if (chosenEffect.quality === "good") {
            chosenEffect.emoji = "🍪";
        } else {
            // Bad grandma
            chosenEffect.emoji = "👵";
        }
    }

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
        displayMeter: chosenEffect.displayMeter,
        instanceId: nextInstanceId(),
        id: chosenEffect.id,
        xPos: xPos,
        yPos: yPos,
        type: chosenEffect.type,
        quality: chosenEffect.quality,
    }

    return effect;
}
