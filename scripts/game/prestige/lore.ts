import store from "../../redux/reduxStore";

/**
 * The story of the Big Emoji, told a chapter per prestige. The prologue is there from
 * the start; each prestige unlocks the next chapter, which the ascension reveals.
 *
 * English first: translations fall back to these until the story is settled.
 */
export interface LoreChapter {
    /** The chapter number, also the prestiges needed to read it */
    id: number;
    icon: string;
    title: string;
    text: string;
}

export const loreChapters: LoreChapter[] = [
    {
        id: 0,
        icon: "😀",
        title: "A blank screen",
        text: "Before anything, there was a blank screen. Then a finger touched it, and an emoji appeared. Nobody knows whose finger it was. The emoji didn't know either, but it smiled anyway, because that is what emojis do. Tap it, and it draws another. Draw enough, and they start drawing back. Every emoji empire begins like this: with one tap, and a little too much free time.",
    },
    {
        id: 1,
        icon: "✨",
        title: "The fold",
        text: "Your empire grew so heavy with emojis that the world couldn't hold it. It folded, like a letter closing, back into the Big Emoji. When it opened again, everything was gone. Almost everything. In your hand, something glowed. Essence: what's left of an emoji once you take away the face. It hums. It remembers. And it wants you to build again.",
    },
    {
        id: 2,
        icon: "✍️",
        title: "Echoes",
        text: "This time the Drawing hands seemed to know the way. They hesitated less. One of them waved at you, which hands are not supposed to do. The essence remembers every emoji ever drawn, and some of that memory leaks back into the world. Somewhere very far away, something noticed the fold. It turned over in its sleep.",
    },
    {
        id: 3,
        icon: "📜",
        title: "The sticky note",
        text: "On the back of the Big Emoji you found a sticky note, older than the world. It speaks of trials: runs where the world is cruel on purpose. Why would anyone choose a harder world? The note doesn't say. It just says \"worth it\", with a little 😉 drawn in the corner. The handwriting is shaky, like someone drawing for the very first time.",
    },
    {
        id: 4,
        icon: "⛩️",
        title: "Whispers in the sky",
        text: "Your followers built a temple in the sky. You didn't ask them to. Inside, the walls are covered in drawings of the Big Emoji, and of another one, smaller and older, drawn in that same shaky hand. Under it, one word: FIRST. The priests won't say what it means. They just tap the floor gently, over and over, as if knocking on a door.",
    },
    {
        id: 5,
        icon: "🔬",
        title: "The shape of essence",
        text: "You looked at the essence very closely. Inside each grain sleeps a tiny emoji, too small to have a face yet. Potential, waiting for a reason. Every fold sends billions of them back into the dark, and every new run calls them out again. You are not building an empire, you realise. You are teaching the universe how to smile.",
    },
    {
        id: 6,
        icon: "🕳️",
        title: "Stacked like plates",
        text: "Your scientists pointed their telescopes at the emoji black hole. It wasn't empty. It was full of folded worlds, old empires stacked like plates. Thousands of them. Some had your buildings. Some had buildings you've never seen: a Haunted laundromat, a Moon made of spoons. You were not the first to tap. You might not be the last.",
    },
    {
        id: 7,
        icon: "🌌",
        title: "The other windows",
        text: "Every fold makes a new world, but the old ones don't vanish. They drift. In one, the Big Emoji is 😐 and nobody knows why. In another, everyone taps with their elbows. In one, terrifyingly, there are no emojis at all, only words. Paragraphs of them. You close that window very quickly and decide not to think about it.",
    },
    {
        id: 8,
        icon: "👀",
        title: "It noticed you",
        text: "The First Emoji opened its eyes. It had been watching all along: every tap, every fold. It is smaller than you expected, drawn in wobbly lines by someone who had never drawn before. It looks at you the way you once looked at your first Drawing hand. Proud. A little worried. Mostly proud.",
    },
    {
        id: 9,
        icon: "☝️",
        title: "The first finger",
        text: "The First Emoji speaks, though it doesn't have a mouth yet. \"Before me, there was a blank screen. Then a finger touched it.\" You know this story. You told it. Every time you fold the world, the tap that started everything happens again. Somebody has to make that first tap. It has always been you.",
    },
    {
        id: 10,
        icon: "🤔",
        title: "Why fold?",
        text: "\"Why not keep one world forever?\" you ask. The First Emoji thinks about it for a billion years, which for it is about a minute. \"A world that never ends stops being drawn. It just sits there, finished.\" Then it smiles, wobbly as ever. \"Unfinished is better. Unfinished means someone is still tapping.\"",
    },
    {
        id: 11,
        icon: "✈️",
        title: "The last chapter",
        text: "There is no last chapter. The First Emoji tore it out and folded it into a paper plane. It flew off into the next universe, where someone will find it lying on a blank screen. They'll touch it with one finger, and it will smile, because that is what emojis do. Go on. Fold the world again. Somebody is waiting for the first tap.",
    },
];

export const isChapterUnlocked = (chapter: LoreChapter) => store.getState().prestige.prestiges >= chapter.id;

/** Chapters unlocked by prestiging (the prologue doesn't count), for Lore keeper (perk) */
export const chaptersUnlocked = () => loreChapters.filter(chapter => chapter.id > 0 && isChapterUnlocked(chapter)).length;

/** The chapter the latest prestige unlocked, if it unlocked one */
export function newestChapter() {
    const { prestiges } = store.getState().prestige;
    return loreChapters.find(chapter => chapter.id === prestiges && chapter.id > 0);
}
