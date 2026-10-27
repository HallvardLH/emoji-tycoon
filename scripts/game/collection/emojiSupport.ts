import { Platform } from "react-native";
import emojiVersions from "../../../assets/emojis/emojiVersions.json";
import { effectEmojis } from "../effects/effectData";
import { emojiCategories } from "./emojiCategories";

/**
 * Which emojis this device can draw
 *
 * Phones draw emojis with the system's emoji font, which only has the emojis that
 * existed when that Android version came out. Newer ones come out broken (cut off,
 * or as pieces), so the collection leaves out what the device can't show: those
 * never land on the Big Emoji and don't count towards the totals.
 *
 * emojiVersions.json has the Emoji version each collection emoji was added in (for
 * the ones newer than 4.0, which every supported phone has). Regenerate it from
 * Unicode's emoji-test.txt when emojis are added to the collection.
 */

/** The newest Emoji version the system font has, by Android API level */
function androidEmojiVersion(apiLevel: number) {
    if (apiLevel >= 36) return 16.0; // Android 16
    if (apiLevel >= 35) return 15.1; // Android 15
    if (apiLevel >= 34) return 15.0; // Android 14
    if (apiLevel >= 33) return 14.0; // Android 13
    if (apiLevel >= 31) return 13.1; // Android 12
    if (apiLevel >= 30) return 13.0; // Android 11
    if (apiLevel >= 29) return 12.0; // Android 10
    if (apiLevel >= 28) return 11.0; // Android 9
    if (apiLevel >= 26) return 5.0; // Android 8
    return 4.0;
}

/** The newest Emoji version the system font has on iOS, by major version (the .4 updates add them, so one behind) */
function iosEmojiVersion(major: number) {
    if (major >= 18) return 15.1;
    if (major >= 17) return 15.0;
    if (major >= 16) return 14.0;
    if (major >= 15) return 13.1;
    return 13.0;
}

export const MAX_EMOJI_VERSION =
    Platform.OS === "android" ? androidEmojiVersion(Number(Platform.Version))
        : Platform.OS === "ios" ? iosEmojiVersion(parseInt(String(Platform.Version), 10))
            // Browsers draw with the computer's own emoji font, usually up to date
            : Infinity;

const versions = emojiVersions as Record<string, Record<string, number>>;

/** Whether this device can draw the emoji at this index of a collection category */
export const isEmojiSupported = (category: string, index: number) =>
    (versions[category]?.[index] ?? 0) <= MAX_EMOJI_VERSION;

/**
 * Whether the emoji at this index of a category can turn up on the Big Emoji and
 * counts towards the collection: not an effect emoji (those are kept for effects),
 * and one this device can draw
 */
export const isCollectible = (category: string, index: number) =>
    isEmojiSupported(category, index) && !effectEmojis.includes(emojiCategories[category][index]);
