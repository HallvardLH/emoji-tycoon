import React, { useLayoutEffect, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import store, { RootState } from "../../scripts/redux/reduxStore";
import { selectRandomEmoji } from "../../scripts/game/bigEmoji";
import Emoji from "./Emoji";

// How long a drop takes to fall one screen height
const FALL_MS = 9000;
const MAX_DROPS = 40;
const MIN_SIZE = 22;
const MAX_SIZE = 40;
const MIN_OPACITY = 0.12;
const MAX_OPACITY = 0.5;
// Closest two drops get, centre to centre
const MIN_DISTANCE = 48;

interface Drop {
    emoji: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
}

interface Size {
    width: number;
    height: number;
}

/**
 * Drops per screen. Grows with production on a log scale, so every upgrade that raises it
 * thickens the rain a little: about 2 at 1 /sec, 10 at 100, 30 at a million
 */
function dropCount() {
    const eps = store.getState().values.emojisPerSecond;
    return Math.min(MAX_DROPS, Math.round(Math.log10(eps + 1) * 5));
}

/** The active effects' emojis while any are on, otherwise any emoji that can be on the Big Emoji */
function pickEmoji() {
    const effects = store.getState().effects.effects;
    if (effects.length > 0) return effects[Math.floor(Math.random() * effects.length)].emoji;
    return selectRandomEmoji().emoji;
}

/** A screenful of drops, scattered so none overlap. Read from the store once per fall, not on every tick */
function makeDrops({ width, height }: Size): Drop[] {
    const count = dropCount();
    const drops: Drop[] = [];
    for (let attempt = 0; drops.length < count && attempt < count * 4; attempt++) {
        const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
        const x = Math.random() * Math.max(0, width - size);
        const y = Math.random() * Math.max(0, height - size);
        if (drops.some(drop => Math.hypot(drop.x - x, drop.y - y) < MIN_DISTANCE)) continue;
        // Bigger drops are nearer, so brighter
        const opacity = MIN_OPACITY + ((size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * (MAX_OPACITY - MIN_OPACITY);
        drops.push({ emoji: pickEmoji(), x, y, size: Math.round(size), opacity });
    }
    return drops;
}

/**
 * Emojis drifting down behind the Big Emoji, more of them as production grows, and the
 * active effects' emojis while any are on. Off with Reduce animations.
 *
 * Kept cheap, as it runs all the time: two screen-tall tiles of drops slide down on the
 * native driver, half a fall apart, and each is refilled only once it has left the screen.
 * So the rain renders once per fall and never with the game ticks (it subscribes to none of
 * the game), and the drops keep their views from one fall to the next.
 */
export default function EmojiRain() {
    const reduceAnimations = useSelector((state: RootState) => state.preferences.reduceAnimations ?? false);
    const [size, setSize] = useState<Size | null>(null);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0 && (width !== size?.width || height !== size?.height)) setSize({ width, height });
    };

    if (reduceAnimations) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
            {size && (
                <>
                    <RainTile size={size} startAt={0} />
                    <RainTile size={size} startAt={0.5} />
                </>
            )}
        </View>
    );
}

/**
 * One tile, falling from just above the screen to just below it, then refilled and sent back up.
 * `startAt` is how far through its fall it starts, so the two tiles always cover the screen
 */
function RainTile({ size, startAt }: { size: Size, startAt: number }) {
    const [drops, setDrops] = useState(() => makeDrops(size));
    const progress = useRef(new Animated.Value(startAt)).current;
    // Where it was stopped, to carry on from there
    const at = useRef(startAt);

    // A layout effect, so it stops while the tab is hidden: FreezeWhenBlurred suspends hidden
    // tabs, and React unmounts layout effects in a hidden Suspense tree and remounts them when shown
    useLayoutEffect(() => {
        let stopped = false;
        const fall = (from: number) => {
            progress.setValue(from);
            Animated.timing(progress, {
                toValue: 1,
                duration: FALL_MS * 2 * (1 - from),
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (!finished || stopped) return;
                // Below the screen now: refill it while it's out of sight, then back to the top
                setDrops(makeDrops(size));
                fall(0);
            });
        };
        fall(at.current);
        return () => {
            stopped = true;
            progress.stopAnimation(value => { at.current = value; });
        };
    }, [size.width, size.height]);

    const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-size.height, size.height] });

    return (
        <Animated.View
            style={[styles.tile, { width: size.width, height: size.height, transform: [{ translateY }] }]}
            // Drawn once as a bitmap and moved, rather than redrawing every emoji each frame
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
        >
            {drops.map((drop, i) => (
                // Keyed by place, so a refill updates the same views instead of making new ones
                <View key={i} style={[styles.drop, { left: drop.x, top: drop.y }]}>
                    <Emoji icon={drop.emoji} size={drop.size} opacity={drop.opacity} />
                </View>
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tile: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    drop: {
        position: "absolute",
    },
});
