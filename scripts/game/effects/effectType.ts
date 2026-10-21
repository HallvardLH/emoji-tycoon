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
    // Position on screen as a fraction (0 - 1) of the free space, see EffectPopup
    xPos: number;
    yPos: number;
    /** @deprecated no longer used, positions are fractions */
    margin?: number;
    type: EffectTypes;
    // Whether the effect helps or sabotages the player
    quality: "good" | "bad";
}