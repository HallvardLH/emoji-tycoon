function getUpgradePrice(tier: number, tierPosition: number) {

    return Math.pow(10, tier) * Math.round(Math.pow(10, tierPosition + 1))
}

export const emojiUpgrades = [
    {
        name: "Dog helper",
        icon: "🐕",
        description: "Taps your screen with its snout.",
        quote: "WOOF! I'll help you get emojis!",
        price: getUpgradePrice(0, 0),
        tier: 0,
        tierPosition: 0,
        effect: "+10% emojis per tap",
        id: 400
    },
    {
        name: "Cat helper",
        icon: "🐈",
        description: "Tickles you with its whiskers, making you tap faster.",
        quote: "Meow! I'll help you get emojis!",
        price: getUpgradePrice(0, 1),
        tier: 0,
        tierPosition: 1,
        effect: "+10% emojis per tap",
        id: 401
    },
    {
        name: "Duck helper",
        icon: "🦆",
        description: "Pecks you in your side with its beak, making you tap faster.",
        quote: "Quack! I'll help you get emojis!",
        price: getUpgradePrice(0, 2),
        tier: 0,
        tierPosition: 2,
        effect: "+10% emojis per tap",
        id: 402
    },
    {
        name: "Cow helper",
        icon: "🐄",
        description: "Swings its udders into your screen, making you tap faster.",
        quote: "Moo! I'll help you get emojis!",
        price: getUpgradePrice(0, 3),
        tier: 0,
        tierPosition: 3,
        effect: "+10% emojis per tap",
        id: 403
    },
]