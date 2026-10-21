import { roundToPrettyNumber } from "../../utils";

interface BuildingData {
    name: string;
    /** Its position in the list below */
    buildingId: number;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

// Each building costs this much more than the last one of its kind
export const BUILDING_PRICE_GROWTH = 1.175;

/** ×10 per building. (The black hole and singularity used to cost another ×10, which was the biggest wall in the game.) */
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
        return roundToPrettyNumber(Math.round(eps))
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
        icon: "✍️",
        description: "A hand that draws emojis for you.",
    },
    {
        name: "Graphic design studio",
        icon: "🎨",
        description: "A studio where emojis are created.",
    },
    {
        name: "Farm",
        icon: "🌽",
        description: "A farm where emojis sprout from the ground.",
    },
    {
        name: "Restaurant",
        icon: "🍽️",
        description: "Where emojis go to eat food emojis.",
    },
    {
        name: "Petting zoo",
        icon: "🦒",
        description: "Meet all your favorite emoji animals.",
    },
    {
        name: "Factory",
        icon: "🏭",
        description: "Creating emojis on an industrial scale.",
    },
    {
        name: "Sports center",
        icon: "🏈",
        description: 'Keep your emojis in good shape.',
    },
    {
        name: "Emoji cinema",
        icon: "🎬",
        description: "Blockbusters starring your favourite emojis. Every ticket comes with popcorn and emojis.",
    },
    {
        name: "Bank",
        icon: "🏦",
        description: '"We keep your emojis safe."',
    },
    {
        name: "Emoji theme park",
        icon: "🎢",
        description: '"Welcome to EmojiLand: Where dreams and emotions come to life!"',
    },
    {
        name: "Emoji assembly",
        icon: "🏛️",
        description: "Where emojis get together to decide how to make more emojis.",
    },
    {
        name: "Emoji airline",
        icon: "✈️",
        description: "Flies emojis to every corner of the world. Window seat, of course.",
    },
    {
        name: "Space station",
        icon: "🛰️",
        description: "Conquer new worlds and take their emojis.",
    },
    {
        name: "Candy kingdom",
        icon: "🍭",
        description: "A sugary paradise ruled by the Candy King and his sweet emoji subjects.",
    },
    {
        name: "Emoji volcano",
        icon: "🌋",
        description: "Every eruption brings a flood of brand-new, freshly-forged emojis!",
    },
    {
        name: "Temple of the Big Emoji in the sky",
        icon: "🏯",
        description: "Legends say the Big Emoji in the sky bestows infinite emojis upon its most loyal followers.",
    },
    {
        name: "Emoji supercomputer",
        icon: "🖥️",
        description: "The ultimate emoji engine. Multiplies emojis at lightspeed.",
    },
    {
        name: "Emoji black hole",
        icon: "🕳️",
        description: "The final destination of all emojis… or a new beginning?",
    },
    {
        name: "Emoji singularity",
        icon: "⚛️",
        description: "That's it. Nothing remains besides emojis. You've done it. Or have you?",
    },
    {
        name: "Emoji time machine",
        icon: "🕰️",
        description: "Pops back to the dawn of time to draw the very first emojis. Then the second ones.",
    },
    {
        name: "Big bang",
        icon: "💥",
        description: "A brand-new universe, and this time it's emojis all the way down.",
    },
    {
        name: "Emoji multiverse",
        icon: "🌀",
        description: "Infinite universes, each with its own emoji tycoon. They all work for you now.",
    },
    {
        name: "The first emoji",
        icon: "🙂",
        description: "Where it all began. It's been watching you tap this whole time.",
    },
    // Ids come from the order here, so a building can be added anywhere (upgrade files look
    // theirs up with buildingIdOf). Price and output follow from the id.
    // For drawing hands, we make sure there is no rounding in the base EPS
].map((building, buildingId) => ({
    ...building,
    buildingId,
    basePrice: getBaseBuildingPrice(buildingId),
    baseEps: getBaseEps(buildingId, buildingId === 0),
}));

/** A building's id, from its name */
export function buildingIdOf(name: string) {
    const id = buildingData.findIndex(building => building.name === name);
    if (id === -1) throw new Error(`Unknown building: ${name}`);
    return id;
}