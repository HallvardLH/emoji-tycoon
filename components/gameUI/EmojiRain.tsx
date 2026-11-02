import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, AppState, Easing, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import store, { RootState } from "../../scripts/redux/reduxStore";
import { selectRandomEmoji } from "../../scripts/game/bigEmoji";
import Emoji from "./Emoji";
import { watchingChance } from "../../scripts/game/prestige/story";

// How long a drop takes to fall one screen height
const FALL_MS = 9000;
const MAX_DROPS = 40;
const MIN_SIZE = 22;
const MAX_SIZE = 40;
const MIN_OPACITY = 0.12;
const MAX_OPACITY = 0.5;
// Closest two drops get, centre to centre
const MIN_DISTANCE = 48;

// Screen-tall tiles of drops, one above the other, so two are on screen at a time and
// the third waits below the screen, out of sight, for a refill
const TILES = 3;
// One trip round for a tile: down TILES screen heights
const CYCLE_MS = FALL_MS * TILES;

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
    // Something is watching (story.ts)
    if (Math.random() < watchingChance()) return "👀";
    const effects = store.getState().effects.effects;
    if (effects.length > 0) return effects[Math.floor(Math.random() * effects.length)].emoji;
    return selectRandomEmoji().emoji;
}

/**
 * A screenful of drops, scattered so none overlap. Kept half the spacing away from the top
 * and bottom, so drops don't crowd the ones in the tiles above and below either.
 * Reads the store once per refill, not on every tick
 */
function makeDrops({ width, height }: Size): Drop[] {
    const count = dropCount();
    const edge = MIN_DISTANCE / 2;
    const drops: Drop[] = [];
    for (let attempt = 0; drops.length < count && attempt < count * 4; attempt++) {
        const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
        const x = Math.random() * Math.max(0, width - size);
        const y = edge + Math.random() * Math.max(0, height - size - edge * 2);
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
            {size && <Rain key={`${size.width}x${size.height}`} size={size} />}
        </View>
    );
}

/**
 * Kept cheap, as it runs all the time. One clock, `progress`, goes from 0 to 1 per cycle
 * on the native driver, and every tile's place is worked out from it (natively, with
 * modulo), a third of a cycle apart. As the tiles share the one clock they can't drift
 * apart, however often the rain is stopped and started (the app closing, the tab hidden).
 *
 * The clock runs a third of a cycle at a time. Each third ends as a tile falls off the
 * bottom of the screen, and that tile is refilled while it waits out of sight. So the
 * rain renders one tile per fall and never with the game ticks (it subscribes to none of
 * the game), and the drops keep their views from one fall to the next.
 */
function Rain({ size }: { size: Size }) {
    const [tiles, setTiles] = useState(() => Array.from({ length: TILES }, () => makeDrops(size)));
    const progress = useRef(new Animated.Value(0)).current;
    // Where the clock was stopped, to carry on from there
    const at = useRef(0);

    // Tile i is `i` thirds of a cycle ahead, and goes from one screen above the screen
    // (entering) down to one below it (out of sight, waiting), then back to the top
    const translates = useMemo(() => Array.from({ length: TILES }, (_, i) =>
        Animated.modulo(Animated.add(progress, i / TILES), 1).interpolate({
            inputRange: [0, 1],
            outputRange: [-size.height, (TILES - 1) * size.height],
        }),
    ), [size.height]);

    // A layout effect, so it stops while the tab is hidden: FreezeWhenBlurred suspends hidden
    // tabs, and React unmounts layout effects in a hidden Suspense tree and remounts them when shown
    useLayoutEffect(() => {
        let running = false;

        const fall = (from: number) => {
            // To the end of this third
            const step = Math.floor(from * TILES + 1e-6) + 1;
            const to = step / TILES;
            progress.setValue(from);
            Animated.timing(progress, {
                toValue: to,
                duration: CYCLE_MS * (to - from),
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished, value }) => {
                if (!finished) {
                    if (value !== undefined) at.current = value % 1;
                    return;
                }
                if (!running) return;
                // The tile that's just left the bottom of the screen: tile i is there when
                // (progress + i / TILES) is (TILES - 1) / TILES of the way round
                const offScreen = (((TILES - 1 - step) % TILES) + TILES) % TILES;
                setTiles(current => current.map((drops, i) => i === offScreen ? makeDrops(size) : drops));
                fall(to % 1);
            });
        };

        const start = () => {
            if (running) return;
            running = true;
            fall(at.current);
        };
        const stop = () => {
            if (!running) return;
            running = false;
            progress.stopAnimation(value => { at.current = value % 1; });
        };

        start();
        // Nothing to draw with the app closed
        const subscription = AppState.addEventListener("change", state => state === "active" ? start() : stop());
        return () => {
            subscription.remove();
            stop();
        };
    }, []);

    return (
        <>
            {tiles.map((drops, i) => <RainTile key={i} drops={drops} size={size} translateY={translates[i]} />)}
        </>
    );
}

/** One screen-tall tile of drops, re-rendered only when it's refilled */
const RainTile = React.memo(({ drops, size, translateY }: { drops: Drop[], size: Size, translateY: Animated.AnimatedInterpolation<number> }) => (
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
));

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
