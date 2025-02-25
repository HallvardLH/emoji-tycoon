import { roundToPrettyNumber } from "../../utils";

interface BuildingData {
    name: string;
    buildingId: number;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

export function getBaseBuildingPrice(num: number) {
    const price = 10 * Math.pow(10, num)
    return roundToPrettyNumber(price)
}

function getBaseEps(num: number, noRound?: boolean) {
    if (noRound) {
        return 0.1 * Math.pow(10, num)
    } else {
        let factor = 1.8
        if (num <= 8) { factor = 1.85 }
        if (num <= 6) { factor = 1.9 }
        if (num <= 2) { factor = 1.95 }

        // Inspired by Cookie Clicker's base cps curve
        let eps = Math.ceil((Math.pow(num, num * 0.5 + factor)) * 10) / 10
        return roundToPrettyNumber(eps)
    }
}

export function testPriceAndEps() {
    for (let i = 0; i < 11; i++) {
        console.log(buildingData[i].name, ((getBaseEps(i) / getBaseBuildingPrice(i)) * 100).toFixed(4))
    }
}

// TODO: In each building's Details, you can see all the upgrades you have bought for the building

export const buildingData: BuildingData[] = [
    {
        name: "Drawing hand",
        buildingId: 0,
        icon: "✍️",
        description: "A hand that draws emojis for you.",
    },
    {
        name: "Graphic design studio",
        buildingId: 1,
        icon: "🎨",
        description: "A studio where emojis are created.",
    },
    {
        name: "Farm",
        buildingId: 2,
        icon: "🌽",
        description: "A farm where emojis sprout from the ground.",
    },
    {
        name: "Restaurant",
        buildingId: 3,
        icon: "🍽️",
        description: "Where emojis go to eat food emojis.",
    },
    {
        name: "Petting zoo",
        buildingId: 4,
        icon: "🦒",
        description: "Meet all your favorite emoji animals.",
    },
    {
        name: "Factory",
        buildingId: 5,
        icon: "🏭",
        description: "Creating emojis on an industrial scale.",
    },
    {
        name: "Sports center",
        buildingId: 6,
        icon: "🏈",
        description: 'Keep your emojis in good shape.',
    },
    {
        name: "Bank",
        buildingId: 7,
        icon: "🏦",
        description: '"We keep your emojis safe."',
    },
    {
        name: "Emoji theme park",
        buildingId: 8,
        icon: "🎢",
        description: '"Welcome to EmojiLand: Where dreams and emotions come to life!"',
    },
    {
        name: "Emoji assembly",
        buildingId: 9,
        icon: "🏛️",
        description: "Where emojis get together to decide how to make more emojis.",
    },
    {
        name: "Space station",
        buildingId: 10,
        icon: "🛰️",
        description: "Conquer new worlds and take their emojis.",
    },
    {
        name: "Candy kingdom",
        buildingId: 11,
        icon: "🍭",
        description: "A sugary paradise ruled by the Candy King and his sweet emoji subjects.",
    },
    {
        name: "Emoji volcano",
        buildingId: 12,
        icon: "🌋",
        description: "Every eruption brings a flood of brand-new, freshly-forged emojis!",
    },
    {
        name: "Temple of the Big Emoji in the sky",
        buildingId: 13,
        icon: "🏯",
        description: "Legends say the Big Emoji in the sky bestows infinite emojis upon its most loyal followers.",
    },
    {
        name: "Emoji supercomputer",
        buildingId: 14,
        icon: "🖥️",
        description: "The ultimate emoji engine. Multiplies emojis at lightspeed.",
    },
    {
        name: "Emoji black hole",
        buildingId: 15,
        icon: "🕳️",
        description: "The final destination of all emojis… or a new beginning?",
    },
    {
        name: "Emoji singularity",
        buildingId: 16,
        icon: "⚛️",
        description: "That's it. Nothing remains besides emojis. You've done it.",
    },
    // Automatically adds base price and emojis per second
    // For drawing hands, we make sure there is no rounding in the base EPS
].map(building => ({
    ...building,
    basePrice: getBaseBuildingPrice(building.buildingId),
    baseEps: getBaseEps(building.buildingId, building.buildingId === 0),
}));