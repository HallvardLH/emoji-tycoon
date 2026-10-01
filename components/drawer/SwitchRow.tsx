import { View, Pressable, StyleSheet } from 'react-native';
import Text from '../generalUI/Text';
import { palette, radii } from '../misc/theme';

interface SwitchRowProps {
    icon: string;
    label: string;
    /** A line under the label explaining what it does */
    hint?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

/** A full-width drawer row with an on/off switch */
export default function SwitchRow({ icon, label, hint, value, onChange }: SwitchRowProps) {
    return (
        <Pressable
            onPress={() => onChange(!value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            accessibilityLabel={label}
            style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
            <Text size={18} style={styles.icon}>{icon}</Text>
            <View style={styles.text}>
                <Text font="bold" size={14}>{label}</Text>
                {hint ? <Text font="bold" size={12} color={palette.lilac}>{hint}</Text> : null}
            </View>
            <View style={[styles.switchTrack, value ? styles.switchTrackOn : null]}>
                <View style={[styles.switchKnob, value ? styles.switchKnobOn : null]} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
    },
    pressed: {
        opacity: 0.7,
    },
    icon: {
        lineHeight: 24,
    },
    text: {
        flex: 1,
        gap: 2,
    },
    switchTrack: {
        width: 44,
        height: 26,
        borderRadius: 13,
        padding: 3,
        backgroundColor: palette.shade,
    },
    switchTrackOn: {
        backgroundColor: palette.sun,
    },
    switchKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: palette.lilac,
    },
    switchKnobOn: {
        marginLeft: 18,
        backgroundColor: "#FFFFFF",
    },
});
