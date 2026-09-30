import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../scripts/redux/reduxStore";
import { Effect } from "../../../scripts/game/effects/effectType";
import Text from "../../generalUI/Text";
import { palette, radii } from "../../misc/theme";

/** Short chip label, e.g. "×2 tapping" or "×0.5 production" */
function effectLabel(effect: Effect) {
    if (effect.eptMult) return `×${effect.eptMult} tapping`;
    if (effect.epsMult) return `×${effect.epsMult} production`;
    return effect.title;
}

/** Active boosts as paper chips with a countdown bar */
export default function EffectMeters() {
    const { effects } = useSelector((state: RootState) => state.effects);
    const shown = effects.filter((effect) => effect.displayMeter !== false);

    if (shown.length === 0) return null;

    return (
        <View style={styles.container}>
            {shown.map((effect) => {
                const bad = effect.quality === "bad";
                const barColor = bad ? palette.pop : effect.type === "production" ? palette.green : palette.violet;
                const iconBg = bad ? "#FFE3E8" : effect.type === "production" ? palette.mint : palette.tile;
                const percentage = Math.max(0, Math.min(100, (effect.timeLeft / (effect.originalDuration || 1)) * 100));

                return (
                    <View key={effect.instanceId} style={styles.chip} accessibilityLabel={`${effect.title}, ${effect.timeLeft} seconds left`}>
                        <View style={[styles.icon, { backgroundColor: iconBg }]}>
                            <Text size={17} style={{ lineHeight: 22 }}>{effect.emoji}</Text>
                        </View>
                        <View style={styles.body}>
                            <Text font="black" size={12} color={palette.ink}>{effectLabel(effect)} · {effect.timeLeft}s</Text>
                            <View style={styles.track}>
                                <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: barColor }]} />
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
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
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
