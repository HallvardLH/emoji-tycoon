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
        name: "Kitchen",
        icon: "🔪",
        description: "Where food emojis are created.",
        basePrice: getBasePrice(2),
        baseEps: getBaseEps(2),
    },
];
