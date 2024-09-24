interface BuildingData {
    name: string;
    buildingId: number;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

export function getBaseBuildingPrice(num: number) {
    return 10 * Math.pow(9, num)
}

// export function getBaseBuildingPrice(num: number) {
//     return Math.round(10 * Math.pow(10.5, num))
// }

function getBaseEps(num: number, noRound?: boolean) {
    if (noRound) { return 0.1 * Math.pow(9, num) }
    else { return Math.ceil(0.1 * Math.pow(9, num)) }
}

// TODO: In each building's Details, you can see all the upgrades you have bought for the building

export const buildingData: BuildingData[] = [
    {
        name: "Drawing hand",
        buildingId: 0,
        icon: "✍️",
        description: "A hand that draws emojis for you.",
        basePrice: getBaseBuildingPrice(0),
        baseEps: getBaseEps(0, true),
    },
    {
        name: "Graphic design studio",
        buildingId: 1,
        icon: "🎨",
        description: "A studio where emojis are created.",
        basePrice: getBaseBuildingPrice(1),
        baseEps: getBaseEps(1),
    },
    {
        name: "Farm",
        buildingId: 2,
        icon: "🌽",
        description: "A farm where emojis sprout from the ground.",
        basePrice: getBaseBuildingPrice(2),
        baseEps: getBaseEps(2),
    },
    {
        name: "Restaurant",
        buildingId: 3,
        icon: "🍽️",
        description: "Where emojis go to eat food emojis.",
        basePrice: getBaseBuildingPrice(3),
        baseEps: getBaseEps(3),
    },
    {
        name: "Petting zoo",
        buildingId: 4,
        icon: "🦒",
        description: "Meet all your favorite emoji animals.",
        basePrice: getBaseBuildingPrice(4),
        baseEps: getBaseEps(4),
    },
    {
        name: "Factory",
        buildingId: 5,
        icon: "🏭",
        description: "Creating emojis on an industrial scale.",
        basePrice: getBaseBuildingPrice(5),
        baseEps: getBaseEps(5),
    },
    {
        name: "Sports center",
        buildingId: 6,
        icon: "🏈",
        description: 'Keep your emojis healthy.',
        basePrice: getBaseBuildingPrice(6),
        baseEps: getBaseEps(6),
    },
    {
        name: "Bank",
        buildingId: 7,
        icon: "🏦",
        description: '"We keep your emojis safe."',
        basePrice: getBaseBuildingPrice(7),
        baseEps: getBaseEps(7),
    },
    {
        name: "Emoji theme park",
        buildingId: 8,
        icon: "🎢",
        description: '"Welcome to EmojiLand: Where dreams and emotions come to life!"',
        basePrice: getBaseBuildingPrice(8),
        baseEps: getBaseEps(8),
    },
    {
        name: "Emoji assembly",
        buildingId: 9,
        icon: "🏛️",
        description: "Where emojis get together to decide how to make more emojis.",
        basePrice: getBaseBuildingPrice(9),
        baseEps: getBaseEps(9),
    },
    {
        name: "Flying saucer",
        buildingId: 10,
        icon: "🛸",
        description: "Conquer new worlds and take their emojis.",
        basePrice: getBaseBuildingPrice(10),
        baseEps: getBaseEps(10),
    },
];
