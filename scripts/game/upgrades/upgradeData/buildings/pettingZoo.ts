import { getBuildingUpgradePrice } from "../helpers";
import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType } from "../UpgradeType";

const basePettingZooUpgrade = {
    building: "Petting zoo" as BuildingNames,
    buildingId: 5,
    unlockCondition: "Building amount" as UnlockConditionType,
    categories: ["Multiply building production" as UpgradeCateogoriesType],
    emojisPerSecondMultiplier: 2,
    emojisPerTapMultiplier: 0,
    variant: "Standard building" as UpgradeVariantsType,
};

export const pettingZooUpgrades: UpgradeType[] = [
    {
        ...basePettingZooUpgrade,
        name: "Brooms",
        icon: "🧹",
        description: "For cleaning up after the animals when they uhh... go number two.",
        tier: 0,
        id: 500,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Trainers",
        icon: "🐕‍🦺",
        description: "Trainers teach the animals tricks, making the zoo more efficient.",
        tier: 1,
        id: 501,
    },
    {
        ...basePettingZooUpgrade,
        name: "Luxury Pens",
        icon: "🏠",
        description: "Upgrade the animals' homes to keep them happy and productive.",
        tier: 2,
        id: 502,
    },
    {
        ...basePettingZooUpgrade,
        name: "Exotic Animals",
        icon: "🦒",
        description: "Introduce rare and exotic animals to draw in larger crowds.",
        tier: 3,
        id: 503,
    },
    {
        ...basePettingZooUpgrade,
        name: "Zoo Mascots",
        icon: "🎭",
        description: "Friendly mascots encourage visitors, boosting overall income.",
        tier: 4,
        id: 504,
    },
    {
        ...basePettingZooUpgrade,
        name: "Veterinary Clinics",
        icon: "🩺",
        description: "A dedicated clinic keeps the animals healthy.",
        tier: 5,
        id: 505,
    },
    {
        ...basePettingZooUpgrade,
        name: "Shaded Areas",
        icon: "🌳",
        description: "Add shaded areas to keep animals and visitors cool during hot days.",
        tier: 6,
        id: 506,
    },
    {
        ...basePettingZooUpgrade,
        name: "Petting Stations",
        icon: "🖐️",
        description: "Designated areas where visitors can safely interact with the animals.",
        tier: 7,
        id: 507,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Grooming Kits",
        icon: "🛁",
        description: "Regular grooming keeps the animals looking their best and feeling great.",
        tier: 8,
        id: 508,
    },
    {
        ...basePettingZooUpgrade,
        name: "Visitor Benches",
        icon: "🪑",
        description: "Comfortable seating areas for tired visitors.",
        tier: 9,
        id: 509,
    },
    {
        ...basePettingZooUpgrade,
        name: "Souvenir Shops",
        icon: "🛍️",
        description: "A shop selling animal-themed souvenirs.",
        tier: 10,
        id: 510,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Photo Booth",
        icon: "📸",
        description: "Visitors can take photos with the animals.",
        tier: 11,
        id: 511,
    },
    {
        ...basePettingZooUpgrade,
        name: "Zoo Train Ride",
        icon: "🚂",
        description: "A mini train takes visitors on a tour of the zoo.",
        tier: 12,
        id: 512,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Talent Show",
        icon: "🎤",
        description: "Host a talent show where the animals perform tricks",
        tier: 13,
        id: 513,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Parade",
        icon: "🎉",
        description: "Host a daily parade where the animals march through the zoo.",
        tier: 14,
        id: 514,
    },
    {
        ...basePettingZooUpgrade,
        name: "Overpriced Snacks",
        icon: "🍿",
        description: "Charge visitors exorbitant prices for animal-themed snacks",
        tier: 15,
        id: 515,
    },
    {
        ...basePettingZooUpgrade,
        name: "Animal Labor Force",
        icon: "🐘",
        description: "Put the animals to work!",
        tier: 16,
        id: 516,
    },
    {
        ...basePettingZooUpgrade,
        name: "Crowd Control Monkeys",
        icon: "🐒",
        description: "Train monkeys to manage unruly crowds.",
        tier: 17,
        id: 517,
    },
    {
        ...basePettingZooUpgrade,
        name: "Pre-historic animals",
        icon: "🦖",
        description: "Bring dinosaurs and other extinct animals to the zoo.",
        quote: "Life, uh, fins a way",
        tier: 18,
        id: 518,
    },
    {
        ...basePettingZooUpgrade,
        name: "Unicorns",
        icon: "🦄",
        description: "Who doesn't want to see a flying unicorn?",
        tier: 19,
        id: 519,
    },

    // Helpers
    {
        ...basePettingZooUpgrade,
        name: "Dog helper",
        icon: "🐕",
        description: "Taps your screen with its snout.",
        quote: "WOOF! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 0,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 50000
    },
    {
        ...basePettingZooUpgrade,
        name: "Cat helper",
        icon: "🐈",
        description: "Tickles you with its whiskers, making you tap faster.",
        quote: "Meow! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 1,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 50001
    },
    {
        ...basePettingZooUpgrade,
        name: "Duck helper",
        icon: "🦆",
        description: "Pecks you in your side with its beak, making you tap faster.",
        quote: "Quack! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 2,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 50002
    },
    {
        ...basePettingZooUpgrade,
        name: "Cow helper",
        icon: "🐄",
        description: "Swings its udders into your screen, making you tap faster.",
        quote: "Moo! I'll help you get emojis!",
        variant: "Helper",
        tier: 0,
        tierPosition: 3,
        categories: ["Percentage increase tap"],
        unlockCondition: "Building helper",
        emojisPerTapPercentageIncrease: 0.1,
        id: 50003
    },
];