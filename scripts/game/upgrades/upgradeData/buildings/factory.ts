import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const baseFactoryUpgrade = {
    building: "Factory" as BuildingNames,
    buildingId: 5,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const factoryUpgrades: UpgradeType[] = [
    {
        ...baseFactoryUpgrade,
        name: "Better tools",
        icon: "🛠️",
        description: "Better tools for creating emojis faster.",
        tier: 0,
    },
    {
        ...baseFactoryUpgrade,
        name: "More workers",
        icon: "🧑‍🏭",
        description: "Increase the amount of factory employees.",
        tier: 1,
    },
    {
        ...baseFactoryUpgrade,
        name: "Bigger gears",
        icon: "⚙️",
        description: "Bigger gears allow for bigger machinery.",
        tier: 2,
    },
    {
        ...baseFactoryUpgrade,
        name: "Nuts and bolts",
        icon: "🔩",
        description: "These are used to make sure everything doesn't fall apart.",
        tier: 3,
    },
    {
        ...baseFactoryUpgrade,
        name: "Conveyor Belts",
        icon: "📦",
        description: "Streamline production with conveyor belts that move emojis faster than ever!",
        tier: 4,
    },
    {
        ...baseFactoryUpgrade,
        name: "Quality Control",
        icon: "🔍",
        description: "Ensure every emoji is perfect with a dedicated quality control team.",
        tier: 5,
    },
    {
        ...baseFactoryUpgrade,
        name: "Factory Expansion",
        icon: "🏗️",
        description: "Expand your factory to accommodate more machines and workers. Bigger is better!",
        tier: 6,
    },
    {
        ...baseFactoryUpgrade,
        name: "High-Speed Presses",
        icon: "🖨️",
        description: "Upgrade to high-speed presses that stamp out emojis at lightning speed.",
        tier: 7,
    },
    {
        ...baseFactoryUpgrade,
        name: "Factory Gym",
        icon: "🏋️‍♂️",
        description: "A gym for your workers to stay fit and energized. Healthy workers are productive workers!",
        tier: 8,
    },
    {
        ...baseFactoryUpgrade,
        name: "Factory Security",
        icon: "🚨",
        description: "Protect your factory from emoji thieves and industrial espionage.",
        tier: 9,
    },
    {
        ...baseFactoryUpgrade,
        name: "Factory Recycling",
        icon: "♻️",
        description: "Recycle waste materials into new emojis, reducing costs and environmental impact.",
        tier: 10,
    },
    {
        ...baseFactoryUpgrade,
        name: "Ladders for Maintenance",
        icon: "🪜",
        description: "Install ladders for easy access to high machinery. Maintenance has never been easier!",
        tier: 11,
    },
    {
        ...baseFactoryUpgrade,
        name: "Heavy-Duty Hammers",
        icon: "🔨",
        description: "Upgrade to heavy-duty hammers for faster assembly and repairs. Smash through inefficiency!",
        tier: 12,
    },
    {
        ...baseFactoryUpgrade,
        name: "Precision Wrenches",
        icon: "🔧",
        description: "Tighten bolts and screws with precision wrenches. No more loose ends in your production line!",
        tier: 13,
    },
    {
        ...baseFactoryUpgrade,
        name: "Screwdriver Set",
        icon: "🪛",
        description: "A complete set of screwdrivers for fine-tuning your machines. Every detail matters!",
        tier: 14,
    },
    {
        ...baseFactoryUpgrade,
        name: "Toolbox Upgrade",
        icon: "🧰",
        description: "A fully stocked toolbox ensures your workers have the right tool for every job.",
        quote: "Where did I put the- the- where's the- arh nevermind!",
        tier: 15,
    },
    {
        ...baseFactoryUpgrade,
        name: "Reinforced Walls",
        icon: "🧱",
        description: "Strengthen your factory walls to withstand the chaos of high-speed production.",
        tier: 16,
    },
    {
        ...baseFactoryUpgrade,
        name: "Mouse Traps",
        icon: "🪤",
        description: "Keep pesky rodents out of your factory. No more nibbled wires or stolen emojis!",
        tier: 17,
    },
    {
        ...baseFactoryUpgrade,
        name: "Factory managers",
        icon: "👨‍💼",
        description: "Absolutely no work gets done without one of these.",
        quote: "And remember: management wishes to keep bathroom breaks below one minute!",
        tier: 18,
    },
    {
        ...baseFactoryUpgrade,
        name: "Robot workers",
        icon: "🤖",
        description: "Replace weak human workers with strong android workers!",
        tier: 19,
    },
];
