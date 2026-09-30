import { Pressable, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Text from "./Text";
import { palette, radii } from "../misc/theme";

interface ChunkyButtonProps {
    label: string;
    /** Small caps line under the label, e.g. "BUY" or "IN 3 MIN" */
    sublabel?: string;
    onPress?: () => void;
    disabled?: boolean;
    width?: number | `${number}%`;
    height?: number;
    labelSize?: number;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}

const LEDGE = 4;

/**
 * The tactile "Sun" button: sits on a 4px ledge and presses down into it.
 * Disabled buttons are flat and grey.
 */
export default function ChunkyButton(props: ChunkyButtonProps) {
    const { label, sublabel, onPress, disabled = false, width, height = 48, labelSize = 16, accessibilityLabel, style } = props;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? (sublabel ? `${label}, ${sublabel}` : label)}
            accessibilityState={{ disabled }}
            style={[{ width, height: height + LEDGE }, style]}
        >
            {({ pressed }) => (
                <>
                    {!disabled && <View style={[styles.ledge, { height, top: LEDGE }]} />}
                    <View style={[
                        styles.face,
                        { height, marginTop: pressed && !disabled ? LEDGE : 0 },
                        disabled ? styles.faceDisabled : null,
                    ]}>
                        <Text size={labelSize} color={disabled ? palette.muted : palette.ink} numberOfLines={1}>{label}</Text>
                        {sublabel ? (
                            <Text font="black" size={10} color={disabled ? palette.muted : palette.ink} style={styles.sublabel}>{sublabel}</Text>
                        ) : null}
                    </View>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    ledge: {
        position: "absolute",
        left: 0,
        right: 0,
        borderRadius: radii.md,
        backgroundColor: palette.sunLedge,
    },
    face: {
        borderRadius: radii.md,
        backgroundColor: palette.sun,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    faceDisabled: {
        backgroundColor: palette.disabled,
    },
    sublabel: {
        letterSpacing: 0.6,
        marginTop: -1,
    },
});
