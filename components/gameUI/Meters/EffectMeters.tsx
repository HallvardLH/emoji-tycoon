import { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../scripts/redux/reduxStore";
import { Effect } from "../../../scripts/game/effects/effectType";
import Text from "../../generalUI/Text";
import { palette, radii } from "../../misc/theme";

/** Active effects of the same kind, shown as one chip */
interface EffectStack {
    id: number;
    effects: Effect[];
    /** The effect that runs out first, which drives the countdown */
    next: Effect;
    /** All multipliers in the stack combined, as the game multiplies them together */
    eptMult: number;
    epsMult: number;
}

/**
 * Groups active effects by kind (their effectData id, which also fixes their type),
 * in the order each kind first appeared so chips don't jump around
 */
function stackEffects(effects: Effect[]): EffectStack[] {
    const stacks = new Map<number, Effect[]>();
    effects.forEach(effect => stacks.set(effect.id, [...(stacks.get(effect.id) ?? []), effect]));

    return [...stacks.entries()].map(([id, group]) => ({
        id,
        effects: group,
        next: group.reduce((soonest, effect) => effect.timeLeft < soonest.timeLeft ? effect : soonest),
        eptMult: group.reduce((total, effect) => effect.eptMult ? total * effect.eptMult : total, 1),
        epsMult: group.reduce((total, effect) => effect.epsMult ? total * effect.epsMult : total, 1),
    }));
}

/** Short chip label, e.g. "×2 tapping" or "×0.5 production" */
function stackLabel(stack: EffectStack) {
    const round = (n: number) => Math.round(n * 1000) / 1000;
    if (stack.next.eptMult) return `×${round(stack.eptMult)} tapping`;
    if (stack.next.epsMult) return `×${round(stack.epsMult)} production`;
    return stack.next.title;
}

/**
 * A bar that drains smoothly and linearly to empty over the time left.
 *
 * The game counts effects down once a second, so each new timeLeft restarts the
 * glide from where the bar currently is, keeping it in step with the timer.
 */
function CountdownBar({ timeLeft, duration, color }: { timeLeft: number, duration: number, color: string }) {
    const start = Math.max(0, Math.min(1, timeLeft / duration));
    const progress = useRef(new Animated.Value(start)).current;

    useEffect(() => {
        progress.stopAnimation(current => {
            // Snap if the bar is far off, e.g. the stack's next effect changed
            if (Math.abs(current - start) > 0.1) progress.setValue(start);
            Animated.timing(progress, {
                toValue: 0,
                duration: timeLeft * 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        });
    }, [timeLeft, duration]);

    return (
        <View style={styles.track}>
            <Animated.View style={[styles.fill, {
                backgroundColor: color,
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            }]} />
        </View>
    );
}

// How many cards peek out behind a stacked chip, however big the stack
const MAX_LAYERS = 2;
const LAYER_OFFSET = 4;

/** Active boosts as paper chips with a countdown bar, one chip per kind of boost */
export default function EffectMeters() {
    const { effects } = useSelector((state: RootState) => state.effects);
    // Effects that have run out are gone, never shown as an empty bar at 0s
    const stacks = stackEffects(effects.filter((effect) => effect.displayMeter !== false && effect.timeLeft > 0));

    if (stacks.length === 0) return null;

    return (
        <View style={styles.container}>
            {stacks.map((stack) => {
                const { next } = stack;
                const count = stack.effects.length;
                const layers = Math.min(count - 1, MAX_LAYERS);
                const bad = next.quality === "bad";
                const barColor = bad ? palette.pop : next.type === "production" ? palette.green : palette.violet;
                const iconBg = bad ? "#FFE3E8" : next.type === "production" ? palette.mint : palette.tile;

                return (
                    <View
                        key={stack.id}
                        style={{ paddingBottom: layers * LAYER_OFFSET }}
                        accessibilityLabel={count > 1
                            ? `${count} stacked: ${stackLabel(stack)}, next one ends in ${next.timeLeft} seconds`
                            : `${next.title}, ${next.timeLeft} seconds left`}
                    >
                        {/* Cards peeking out underneath, one per extra effect in the stack */}
                        {Array.from({ length: layers }, (_, i) => layers - i).map(depth => (
                            <View
                                key={depth}
                                style={[styles.layer, {
                                    top: depth * LAYER_OFFSET,
                                    bottom: (layers - depth) * LAYER_OFFSET,
                                    left: depth * 5,
                                    right: depth * 5,
                                    opacity: 0.55 - depth * 0.15,
                                }]}
                            />
                        ))}
                        <View style={styles.chip}>
                            <View style={[styles.icon, { backgroundColor: iconBg }]}>
                                <Text size={17} style={{ lineHeight: 22 }}>{next.emoji}</Text>
                                {count > 1 && (
                                    <View style={styles.count}>
                                        <Text font="black" size={10} color="#FFFFFF">{count}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.body}>
                                <Text font="black" size={12} color={palette.ink}>{stackLabel(stack)} · {next.timeLeft}s</Text>
                                <CountdownBar
                                    key={next.instanceId}
                                    timeLeft={next.timeLeft}
                                    duration={next.originalDuration || next.timeLeft}
                                    color={barColor}
                                />
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // Take the row's width so chips wrap instead of running off screen
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 8,
    },
    layer: {
        position: "absolute",
        borderRadius: radii.pill,
        backgroundColor: palette.paper,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 6,
        paddingLeft: 6,
        paddingRight: 12,
        borderRadius: radii.pill,
        backgroundColor: palette.paper,
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    count: {
        position: "absolute",
        top: -5,
        right: -6,
        minWidth: 17,
        height: 17,
        paddingHorizontal: 4,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: palette.paper,
        backgroundColor: palette.ink,
        alignItems: "center",
        justifyContent: "center",
    },
    body: {
        gap: 3,
    },
    track: {
        width: 96,
        height: 4,
        borderRadius: 4,
        backgroundColor: palette.track,
        overflow: "hidden",
    },
    fill: {
        height: 4,
        borderRadius: 4,
    },
})
