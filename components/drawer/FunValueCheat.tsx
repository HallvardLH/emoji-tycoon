import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Text from "../generalUI/Text";
import store, { RootState } from "../../scripts/redux/reduxStore";
import { setFunValue } from "../../scripts/redux/valuesSlice";
import { funValueEffects, getFunValueEffect } from "../../scripts/game/funValues";
import { calculateBuildingsEps } from "../../scripts/game/buildings/buildings";
import { calculateEpt } from "../../scripts/game/calculations";
import { palette, radii } from "../misc/theme";

/** Cheat menu: set the fun value by hand, and a lookup table of what each value does */
export default function FunValueCheat() {
    const funValue = useSelector((state: RootState) => state.values.funValue);
    const [showTable, setShowTable] = useState(false);
    const current = getFunValueEffect(funValue);

    const change = (by: number) => {
        store.dispatch(setFunValue(funValue + by));
        // Some values change production or tapping, so recalculate them
        calculateBuildingsEps();
        calculateEpt();
    };

    return (
        <View style={styles.container}>
            <Text size={16}>Fun value</Text>
            <View style={styles.stepper}>
                {[-10, -1].map(by => <StepButton key={by} label={String(by)} onPress={() => change(by)} />)}
                <View style={styles.value}>
                    <Text size={24} color={palette.ink}>{funValue}</Text>
                </View>
                {[1, 10].map(by => <StepButton key={by} label={`+${by}`} onPress={() => change(by)} />)}
            </View>
            <Text font="bold" size={12} color={palette.lilac} style={{ textAlign: "center" }}>
                {current ? `${current.name}: ${current.description}` : "No quirk"}
            </Text>

            <Pressable
                onPress={() => setShowTable(!showTable)}
                accessibilityRole="button"
                accessibilityState={{ expanded: showTable }}
                style={styles.toggle}
            >
                <Text font="black" size={12} color={palette.lilacLight}>
                    {showTable ? "▾ Hide fun value table" : "▸ Show fun value table"}
                </Text>
            </Pressable>

            {showTable && (
                <View style={styles.table}>
                    {funValueEffects.map(effect => {
                        const active = effect === current;
                        return (
                            <Pressable
                                key={effect.name}
                                // Tap a row to jump to that value
                                onPress={() => change(effect.from - funValue)}
                                accessibilityRole="button"
                                accessibilityLabel={`Set fun value to ${effect.from}: ${effect.name}`}
                                style={[styles.row, active ? styles.rowActive : null]}
                            >
                                <Text size={13} color={active ? palette.ink : palette.sun} style={styles.range}>
                                    {effect.from === effect.to ? effect.from : `${effect.from}–${effect.to}`}
                                </Text>
                                <View style={{ flex: 1 }}>
                                    <Text size={13} color={active ? palette.ink : "#FFFFFF"}>{effect.name}</Text>
                                    <Text font="body" size={11} color={active ? palette.muted : palette.lilac}>{effect.description}</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

function StepButton({ label, onPress }: { label: string, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Change fun value by ${label}`}
            style={({ pressed }) => [styles.step, pressed ? { opacity: 0.7 } : null]}
        >
            <Text size={14}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 260,
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    step: {
        minWidth: 44,
        height: 40,
        paddingHorizontal: 8,
        borderRadius: radii.sm,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    value: {
        minWidth: 56,
        height: 44,
        borderRadius: radii.md,
        backgroundColor: palette.paper,
        alignItems: "center",
        justifyContent: "center",
    },
    toggle: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    table: {
        width: "100%",
        gap: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radii.sm,
        backgroundColor: palette.glassSoft,
    },
    rowActive: {
        backgroundColor: palette.sun,
    },
    range: {
        width: 46,
    },
});
