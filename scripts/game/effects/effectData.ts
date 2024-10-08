import { Effect } from "./effectType";

const effectEmojis = [
    "🚀",
    "💎",
    "🌟",
    "⚡",
    "🍀",
    "💰",
    "📈",
    "🏆"
];

export const effectData: Effect[] = [
    {
        title: "x2 tapping power",
        description: "Emojis per tap doubled!",
        eptMult: 2,
        eptAdd: 0,
        epsMult: 0,
        timeLeft: 20,
        timeLeftOnScreen: 25,
        emoji: "🚀",
        xPos: 100,
        yPos: 100,
        id: 0,
        type: "tap",
    },
    {
        title: "x3 tapping power",
        description: "Emojis per tap tripled!",
        eptMult: 3,
        eptAdd: 0,
        epsMult: 0,
        timeLeft: 20,
        timeLeftOnScreen: 25,
        emoji: "💎",
        xPos: 100,
        yPos: 100,
        id: 1,
        type: "tap",
    },
    // Production multiplier effects
    {
        title: "x2 emoji production",
        description: "Emoji production doubled!",
        eptMult: 0,
        eptAdd: 0,
        epsMult: 2,
        timeLeft: 30,
        timeLeftOnScreen: 25,
        emoji: "🍀",
        xPos: 100,
        yPos: 100,
        id: 100,
        type: "production",
    },
    {
        title: "x77 emoji production",
        description: "Emoji production doubled!",
        eptMult: 0,
        eptAdd: 0,
        epsMult: 77,
        timeLeft: 4,
        timeLeftOnScreen: 10,
        emoji: "😈",
        xPos: 100,
        yPos: 100,
        id: 101,
        type: "production",
    },

]