export type EffectTypes = "tap" | "production" | "give";

export interface Effect {
    title: string;
    description: string;
    emoji: string;
    // Emojis per tap multiplier
    eptMult: number;
    // Emojis per tap added
    eptAdd: number;
    // Emojis per second multiplier
    epsMult: number;
    timeLeft: number;
    // The timeLeft, before being decremented, used for percentage calculation
    originalDuration?: number,
    timeLeftOnScreen: number;
    // Whether the effect should display a timer on screen
    displayMeter: boolean,
    // A unique id for each instance of effect
    instanceId?: number;
    // The id of the effect, in relation to effectData
    id: number;
    xPos: number;
    yPos: number;
    // The style margin given to the on-screen effect
    margin?: number;
    type: EffectTypes;
    // Whether the effect helps or sabotages the player
    quality: "good" | "bad";
}