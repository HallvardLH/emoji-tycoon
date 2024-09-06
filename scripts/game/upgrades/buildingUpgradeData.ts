import { getBaseBuildingPrice } from "../buildings/buildingData"

function getUpgradePrice(tier: number, buildingId: number) {

    return Math.round((getBaseBuildingPrice(buildingId) / 2) * Math.pow(10, tier + 1))
}

export const BUILDING_UPGRADE_TIERS = [0, 1, 2, 3, 4];

export const buildingUpgrades = [
    {
        building: "Drawing hand",
        name: "Stronger arm",
        icon: "💪",
        description: "A stronger arm makes for drawing emojis faster.",
        price: getUpgradePrice(0, 0),
        tier: 0,
        effect: "2x building production and tap",
    },
    {
        building: "Drawing hand",
        name: "Flexible fingers",
        icon: "🖖",
        description: "Flexible fingers allow for more intricate emojis.",
        price: getUpgradePrice(1, 0),
        tier: 1,
        effect: "2x building production and tap",
    },
    {
        building: "Drawing hand",
        name: "Two hands",
        icon: "👐",
        description: "Double the hands, double the emojis!",
        price: getUpgradePrice(2, 0),
        tier: 2,
        effect: "2x building production and tap",
    },
    {
        building: "Drawing hand",
        name: "Bionic arm",
        icon: "🦾",
        description: "Bionic arms to draw emojis super fast!",
        price: getUpgradePrice(3, 0),
        tier: 3,
        effect: "2x building production and tap",
    },
    {
        building: "Drawing hand",
        name: "Tongue",
        icon: "👅",
        description: "With years of practice, you too can learn to draw with your tongue!",
        price: getUpgradePrice(4, 0),
        tier: 4,
        effect: "2x building production and tap",
    },
    // Graphic design studio
    {
        building: "Graphic design studio",
        name: "Improved pencils",
        icon: "✏️",
        description: "Better pencils for more detailed emojis.",
        price: getUpgradePrice(0, 1),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Graphic design studio",
        name: "Specialized crayons",
        icon: "🖍️",
        description: "These special crayons allow artists to access their inner child.",
        price: getUpgradePrice(1, 1),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Graphic design studio",
        name: "Improved brushes",
        icon: "🖌️",
        description: "Improved brushes allow for more artistic emojis.",
        price: getUpgradePrice(2, 1),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Graphic design studio",
        name: "Fountain pens",
        icon: "🖋️",
        description: "Allows for more distinguished emojis.",
        price: getUpgradePrice(3, 1),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Graphic design studio",
        name: "Rulers",
        icon: "📏",
        description: "How else would you draw a straight line?",
        price: getUpgradePrice(4, 1),
        tier: 4,
        effect: "2x building production",
    },
    // Farms
    {
        building: "Farm",
        name: "Carrots",
        icon: "🥕",
        description: "Farms now grow carrots!",
        price: getUpgradePrice(0, 2),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Farm",
        name: "Tomatoes",
        icon: "🍅",
        description: "Juicy!",
        price: getUpgradePrice(1, 2),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Farm",
        name: "Watermelons",
        icon: "🍉",
        description: "Tastes so good!",
        price: getUpgradePrice(2, 2),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Farm",
        name: "Tractors",
        icon: "🚜",
        description: "Makes emoji-harvesting so much easier.",
        price: getUpgradePrice(3, 2),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Farm",
        name: "Emoji cows",
        icon: "🐄",
        description: "Creates more emooooooojis.",
        price: getUpgradePrice(4, 2),
        tier: 4,
        effect: "2x building production",
    },
    // Kitchen
    {
        building: "Kitchen",
        name: "Generic upgrade",
        icon: "🍉",
        description: "Description",
        price: getUpgradePrice(0, 3),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Kitchen",
        name: "Generic upgrade",
        icon: "🍉",
        description: "Description",
        price: getUpgradePrice(1, 3),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Kitchen",
        name: "Generic upgrade",
        icon: "🍉",
        description: "Description",
        price: getUpgradePrice(2, 3),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Kitchen",
        name: "Generic upgrade",
        icon: "🍉",
        description: "Description",
        price: getUpgradePrice(3, 3),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Kitchen",
        name: "Generic upgrade",
        icon: "🍉",
        description: "Description",
        price: getUpgradePrice(4, 3),
        tier: 4,
        effect: "2x building production",
    },
    // Factory
    {
        building: "Factory",
        name: "Better tools",
        icon: "🛠️",
        description: "Better tools for creating emojis faster.",
        price: getUpgradePrice(0, 4),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Factory",
        name: "More workers",
        icon: "🧑‍🏭",
        description: "Increase the amount of factory employees.",
        price: getUpgradePrice(1, 4),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Factory",
        name: "Bigger gears",
        icon: "⚙️",
        description: "Bigger gears allow for bigger machinery.",
        price: getUpgradePrice(2, 4),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Factory",
        name: "Nuts and bolts",
        icon: "🔩",
        description: "These are used to make sure everything doesn't fall apart.",
        price: getUpgradePrice(3, 4),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Factory",
        name: "Robot workers",
        icon: "🤖",
        description: "Replace weak human workers with strong android workers!",
        price: getUpgradePrice(4, 4),
        tier: 4,
        effect: "2x building production",
    },
    // Bank
    {
        building: "Bank",
        name: "Piggy banks",
        icon: "🐖",
        description: "Oink oink!",
        price: getUpgradePrice(0, 5),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Bank",
        name: "Bigger emoji bags",
        icon: "💰",
        description: "Allows for carrying even more emojis.",
        price: getUpgradePrice(1, 5),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Bank",
        name: "Emoji credit cards",
        icon: "💳",
        description: "Good for spending your hard-earned emojis.",
        price: getUpgradePrice(2, 5),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Bank",
        name: "Investment into education",
        icon: "🎓",
        description: "Better education, better emoji-drawing skills.",
        price: getUpgradePrice(3, 5),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Bank",
        name: "Investment into innovation",
        icon: "💡",
        description: "More innovation, more innovative emojis.",
        price: getUpgradePrice(4, 5),
        tier: 4,
        effect: "2x building production",
    },
    // Emoji theme park
    {
        building: "Emoji theme park",
        name: "Merry-go-rounds",
        icon: "🎠",
        description: "You spin me right 'round, baby!",
        price: getUpgradePrice(0, 6),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Emoji theme park",
        name: "Slides",
        icon: "🛝",
        description: "Do you slide on all your nights like this? (I might)",
        price: getUpgradePrice(1, 6),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Emoji theme park",
        name: "Ferris wheel",
        icon: "🎡",
        description: "Way up, there is where she broke my heart.",
        price: getUpgradePrice(2, 6),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Emoji theme park",
        name: "Circus",
        icon: "🎪",
        description: "There's only two types of people in the world. The ones that entertain, and the ones that observe.",
        price: getUpgradePrice(3, 6),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Emoji theme park",
        name: "Emoji juggler",
        icon: "🤹‍♂️",
        description: "They say he's never dropped the ball.",
        price: getUpgradePrice(4, 6),
        tier: 4,
        effect: "2x building production",
    },
    // Emoji assembly
    {
        building: "Emoji assembly",
        name: "Emoji elections",
        icon: "🗳️",
        description: "May the best emoji win!",
        price: getUpgradePrice(0, 7),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Emoji assembly",
        name: "Emoji stimulus",
        icon: "📊",
        description: "You get an emoji, and you, and you, everybody gets emojis!",
        price: getUpgradePrice(1, 7),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Emoji assembly",
        name: "Speaker of the emoji house",
        icon: "🗣️",
        description: "Install your very own emoji speaker, to ensure things go your way.",
        price: getUpgradePrice(2, 7),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Emoji assembly",
        name: "Emoji laws",
        icon: "📜",
        description: "We the emojis...",
        price: getUpgradePrice(3, 7),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Emoji assembly",
        name: "Global emoji confederation",
        icon: "🌍",
        description: "Increases cooperation between emoji countries.",
        price: getUpgradePrice(4, 7),
        tier: 4,
        effect: "2x building production",
    },
    // Flying saucers
    {
        building: "Flying saucer",
        name: "Telescopes",
        icon: "🔭",
        description: "Look into the stars to discover prospective planets.",
        price: getUpgradePrice(0, 8),
        tier: 0,
        effect: "2x building production",
    },
    {
        building: "Flying saucer",
        name: "Satellite antennas",
        icon: "📡",
        description: "Look beyond the Milky Way toward the Emojiway galaxy.",
        price: getUpgradePrice(1, 8),
        tier: 1,
        effect: "2x building production",
    },
    {
        building: "Flying saucer",
        name: "Astronauts",
        icon: "👩‍🚀",
        description: "Pilots the flying saucers to distant planets.",
        price: getUpgradePrice(2, 8),
        tier: 2,
        effect: "2x building production",
    },
    {
        building: "Flying saucer",
        name: "Rockets",
        icon: "🚀",
        description: "Flies really fast.",
        price: getUpgradePrice(3, 8),
        tier: 3,
        effect: "2x building production",
    },
    {
        building: "Flying saucer",
        name: "⍙⟒ ☊⍜⋔⟒ ⟟⋏ ⌿⟒⏃☊⟒...",
        icon: "👽",
        description: "...⏃⋏⎅ ⍙⟒ ⏚⍀⟟⋏☌ ☊⍀⏃⋉⊬ ⋏⟒⍙ ⟒⋔⍜⟊⟟⌇.",
        price: getUpgradePrice(4, 8),
        tier: 4,
        effect: "2x building production",
    },
]