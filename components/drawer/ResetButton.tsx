import { Pressable, StyleSheet } from 'react-native';
import Text from '../generalUI/Text';
import { palette, radii, themedStyles } from '../misc/theme';
import { openResetConfirm } from '../gameUI/ResetModal';

interface ResetButtonProps {
    /** Called when it's pressed, e.g. to close the drawer so the confirmation shows */
    onPress?: () => void;
}

/** Opens the confirmation that resets the game (see ResetModal) */
export default function ResetButton({ onPress }: ResetButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset game"
            onPress={() => {
                onPress?.();
                openResetConfirm();
            }}
            style={({ pressed }) => [styles.button, pressed ? { opacity: 0.7 } : null]}
        >
            <Text size={18} style={{ lineHeight: 24 }}>🗑️</Text>
            <Text font="black" size={14} color={palette.pop}>Reset game</Text>
        </Pressable>
    )
}

const styles = themedStyles(() => StyleSheet.create({
    button: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        borderRadius: radii.md,
        borderWidth: 2,
        borderColor: palette.pop,
    },
}))
