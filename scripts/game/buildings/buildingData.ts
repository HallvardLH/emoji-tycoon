interface BuildingData {
    name: string;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

export function getBaseBuildingPrice(num: number) {
    return 10 * Math.pow(9, num)
}

function getBaseEps(num: number, noRound?: boolean) {
    if (noRound) { return 0.1 * Math.pow(9, num) }
    else { return Math.ceil(0.1 * Math.pow(9, num)) }
}

// TODO: In each building's Details, you can see all the upgrades you have bought for the building

export const buildingData: BuildingData[] = [
    {
        name: "Drawing hand",
        icon: "✍️",
        description: "A hand that draws emojis for you.",
        basePrice: getBaseBuildingPrice(0),
        baseEps: getBaseEps(0, true),
    },
    {
        name: "Graphic design studio",
        icon: "🎨",
        description: "A studio where emojis are created.",
        basePrice: getBaseBuildingPrice(1),
        baseEps: getBaseEps(1),
    },
    {
        name: "Farm",
        icon: "🌽",
        description: "A farm where emojis sprout from the ground.",
        basePrice: getBaseBuildingPrice(2),
        baseEps: getBaseEps(2),
    },
    {
        name: "Kitchen",
        icon: "🔪",
        description: "Where food emojis are created.",
        basePrice: getBaseBuildingPrice(3),
        baseEps: getBaseEps(3),
    },
    {
        name: "Factory",
        icon: "🏭",
        description: "Creating emojis on an industrial scale.",
        basePrice: getBaseBuildingPrice(4),
        baseEps: getBaseEps(4),
    },
    {
        name: "Bank",
        icon: "🏦",
        description: '"We keep your emojis safe."',
        basePrice: getBaseBuildingPrice(5),
        baseEps: getBaseEps(5),
    },
    {
        name: "Emoji assembly",
        icon: "🏛️",
        description: "Where emojis get together to decide how to make more emojis.",
        basePrice: getBaseBuildingPrice(6),
        baseEps: getBaseEps(6),
    },
    {
        name: "Flying saucer",
        icon: "🛸",
        description: "Conquer new worlds and take their emojis.",
        basePrice: getBaseBuildingPrice(7),
        baseEps: getBaseEps(7),
    },
];
