import { Pressable, StyleSheet } from 'react-native';
import Text from '../generalUI/Text';
import { palette, radii } from '../misc/theme';
import { openResetConfirm } from '../gameUI/ResetModal';
import { useTranslation } from 'react-i18next';

interface ResetButtonProps {
    /** Called when it's pressed, e.g. to close the drawer so the confirmation shows */
    onPress?: () => void;
}

/** Opens the confirmation that resets the game (see ResetModal) */
export default function ResetButton({ onPress }: ResetButtonProps) {
    const { t } = useTranslation();
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("drawer.resetGame")}
            onPress={() => {
                onPress?.();
                openResetConfirm();
            }}
            style={({ pressed }) => [styles.button, pressed ? { opacity: 0.7 } : null]}
        >
            <Text size={18} style={{ lineHeight: 24 }}>🗑️</Text>
            <Text font="black" size={14} color={palette.pop}>{t("drawer.resetGame")}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
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
})
