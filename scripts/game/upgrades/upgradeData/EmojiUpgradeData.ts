function getUpgradePrice(tier: number, buildingId: number) {

    return Math.round(Math.pow(10, tier + 1))
}

export const emojiUpgrades = [
    {
        building: "Drawing hand",
        name: "Stronger arm",
        icon: "💪",
        description: "A stronger arm makes for drawing emojis faster.",
        price: getUpgradePrice(0, 0),
        tier: 0,
        effect: "2x building production and tap",
    },
]