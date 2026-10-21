/**
 * Everything the fun value does, for the cheat menu's lookup table.
 *
 * The fun value is a secret number from 1 to 100, rolled on a new game and on reset.
 * Most values do nothing; these give the game a quirk. Keep this list in sync with
 * the howFun() checks in the code.
 */
export interface FunValueEffect {
    from: number;
    to: number;
    name: string;
    description: string;
}

export const funValueEffects: FunValueEffect[] = [
    { from: 1, to: 2, name: "Cookie clicker", description: "Effect emojis are 🍪, bad ones are 👵" },
    { from: 17, to: 17, name: "Devilish", description: "The 😈 ×77 production effect can appear" },
    { from: 31, to: 40, name: "Low gravity", description: "Tapped emojis float up and away" },
    { from: 42, to: 42, name: "The answer", description: "+4.2% production" },
    { from: 50, to: 50, name: "Perfectly balanced", description: "Tapping ×0.5, production ×1.5" },
    { from: 64, to: 64, name: "Overclocked", description: "Combo can go one level higher" },
    { from: 70, to: 75, name: "Impatient", description: "Effect emojis spawn sooner" },
    { from: 76, to: 76, name: "Lucky spawns", description: "10% chance of a bonus effect emoji" },
    { from: 77, to: 77, name: "Flying money", description: "💸 on prices" },
    { from: 88, to: 90, name: "Marathon", description: "Combo drains 25% slower" },
    { from: 91, to: 98, name: "Collector", description: "Shiny emojis 1.25× as likely" },
    { from: 99, to: 99, name: "99 red balloons", description: "Effect emojis are 🎈, bad ones are 📌" },
    { from: 100, to: 100, name: "Sad hundred", description: "Stats shows 😭 by the fun value" },
];

/** The quirk a fun value gives, if any */
export function getFunValueEffect(funValue: number) {
    return funValueEffects.find(effect => funValue >= effect.from && funValue <= effect.to);
}
