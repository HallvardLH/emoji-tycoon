interface BuildingData {
    name: string;
    icon: string;
    description: string;
    basePrice: number;
    baseEps: number;
}

function getBasePrice(num: number) {
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
        basePrice: getBasePrice(0),
        baseEps: getBaseEps(0, true),
    },
    {
        name: "Graphic design studio",
        icon: "🎨",
        description: "A studio where emojis are created.",
        basePrice: getBasePrice(1),
        baseEps: getBaseEps(1),
    },
    {
        name: "Farm",
        icon: "🌽",
        description: "A farm where emojis sprout from the ground.",
        basePrice: getBasePrice(2),
        baseEps: getBaseEps(2),
    },
    {
        name: "Kitchen",
        icon: "🔪",
        description: "Where food emojis are created.",
        basePrice: getBasePrice(3),
        baseEps: getBaseEps(3),
    },
    {
        name: "Factory",
        icon: "🏭",
        description: "Creating emojis on an industrial scale.",
        basePrice: getBasePrice(4),
        baseEps: getBaseEps(4),
    },
    {
        name: "Bank",
        icon: "🏦",
        description: '"We keep your emojis safe."',
        basePrice: getBasePrice(5),
        baseEps: getBaseEps(5),
    },
    {
        name: "Emoji assembly",
        icon: "🏛️",
        description: "Where emojis get together to decide how to make more emojis.",
        basePrice: getBasePrice(6),
        baseEps: getBaseEps(6),
    },
    {
        name: "Flying saucers",
        icon: "🛸",
        description: "Conquer new worlds and take their emojis.",
        basePrice: getBasePrice(7),
        baseEps: getBaseEps(7),
    },
];
