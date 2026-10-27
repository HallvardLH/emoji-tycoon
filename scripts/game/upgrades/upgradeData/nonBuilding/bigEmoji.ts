import { BuildingNames } from "../../../buildings/buildingNamesType";
import { UpgradeType, UnlockConditionType, UpgradeVariantsType, UpgradeCateogoriesType, } from "../UpgradeType";

export const BIG_EMOJI_BUILDING_ID = 1000;
// Base object
const baseBigEmojiUpgrade = {
    building: "Big emoji" as BuildingNames,
    buildingId: BIG_EMOJI_BUILDING_ID,
    unlockCondition: "Emojis from tapping" as UnlockConditionType,
    categories: ["Tap percentage of eps" as UpgradeCateogoriesType],
    variant: "Big emoji percentage" as UpgradeVariantsType,
    tier: 0 as 0,
    emojisPerTapPercentageOfEps: 0.01,
};

const hands: UpgradeType[] = [
    {
        ...baseBigEmojiUpgrade,
        name: "Another hand",
        icon: "👈",
        description: "Another hand taps the screen. Whose hand is it? I don't know.",
        tier: 0,
        id: 0,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Yet another hand",
        icon: "👉",
        description: "One more hand taps the screen. Very handy!",
        tier: 1,
        id: 1,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Ten more hands",
        icon: "👆",
        description: "Ten hands suddenly start tapping your screen! It's great!",
        tier: 2,
        id: 2,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "One hundred hands!",
        icon: "👇",
        description: "The whole neighborhood has shown up to tap the big emoji on the screen!",
        tier: 3,
        id: 3,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "A thousand hands",
        icon: "☝️",
        description: "People travel from far away just to tap your screen.",
        tier: 4,
        id: 4,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Million hands",
        icon: "🤞",
        description: "Who are you pointing at? Are you pointing at me? How rude...",
        tier: 5,
        id: 5,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Billion hands",
        icon: "🙌",
        description: "More than 10% of the world's population helps you tap your screen. I think it's about to break.",
        tier: 6,
        id: 6,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Trillion hands",
        icon: "🤙",
        description: "Your mom calls. She's worried about you. Annoyed that the call covers the screen, you hang up and continue tapping.",
        tier: 7,
        id: 7,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Quadrillion hands",
        icon: "🤛",
        description: "There are a lot of hands tapping your screen.",
        tier: 8,
        id: 8,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Quintillion hands",
        icon: "🤜",
        description: "The sheer number of hands is incomprehensible. The screen is taking a beating.",
        tier: 9,
        id: 9,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Sextillion hands",
        icon: "✋",
        description: "Hands stretch out as far as the eye can see, all tapping away.",
        tier: 10,
        id: 10,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Septillion hands",
        icon: "👌",
        description: "Perfect form. Perfect taps. Infinite hands.",
        tier: 11,
        id: 11,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Octillion hands",
        icon: "🖐️",
        description: "More hands than atoms in the universe. They all know what they're doing.",
        tier: 12,
        id: 12,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Nonillion hands",
        icon: "🤚",
        description: "The sound of the tapping is now an immensely loud, rhythmic thump that sends a shockwave around the world.",
        tier: 13,
        id: 13,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Decillion hands",
        icon: "✌️",
        description: "Such a large amount of flesh should never be gathered so tightly in the same space...",
        tier: 14,
        id: 14,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Undecillion hands",
        icon: "🖖",
        description: "From the already present hands grow dozens more, twisted and malformed.",
        tier: 15,
        id: 15,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Duodecillion hands",
        icon: "🤟",
        description: "You start hearing whispers. The hands keep tapping, but whose are they?",
        tier: 16,
        id: 16,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Tredecillion hands",
        icon: "🤏",
        description: "The hands begin to warp. They're no longer human.",
        tier: 17,
        id: 17,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Quattuordecillion hands",
        icon: "👐",
        description: "A presence lurks behind the hands, guiding them with malicious intent.",
        tier: 18,
        id: 18,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Quindecillion hands",
        icon: "🤲",
        description: "These hands... what are they? The air smells of sulfur.",
        tier: 19,
        id: 19,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Sexdecillion hands",
        icon: "🖤",
        description: "The hands are everywhere, filling the room. You feel them grasping at you...",
        tier: 20,
        id: 20,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Demon hands",
        icon: "👹",
        description: "Demonic hands from the depths of hell tap endlessly. The screen is red-hot to the touch.",
        tier: 21,
        id: 21,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Hands of the damned",
        icon: "👻",
        description: "Ghostly, skeletal hands rise from the abyss. They tap with infernal rage.",
        tier: 22,
        id: 22,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "The lord of the Underworld",
        icon: "💀",
        description: "The fallen angel himself crawls up from his dominion in order to help you tap your screen.",
        tier: 23,
        id: 23,
    },
    {
        ...baseBigEmojiUpgrade,
        name: "Rude tapping",
        icon: "🖕",
        description: "Really, really rude.",
        tier: 24,
        id: 24,
    }


];

// The first hands each add 1% of production to every tap; from the sixth on, 0.1%.
// Tap multipliers multiply the whole tap, hands included, so with every hand at 1%
// (25% in all) tapping outgrew production by thousands of times late in the game.
const FULL_SHARE_HANDS = 5;
const LATE_HAND_SHARE = 0.001;

export const bigEmojiUpgrades: UpgradeType[] = hands.map(upgrade => upgrade.tier < FULL_SHARE_HANDS
    ? upgrade
    : { ...upgrade, emojisPerTapPercentageOfEps: LATE_HAND_SHARE });