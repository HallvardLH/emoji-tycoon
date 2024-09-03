export type EffectTypes = "tap" | "production";

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
    timeLeftOnScreen: number;
    id: number;
    xPos: number;
    yPos: number;
    type: EffectTypes;
}