import { Pressable, StyleSheet } from 'react-native';
import Text from '../generalUI/Text';
import { palette, radii, themedStyles } from '../misc/theme';
import { openResetConfirm } from '../gameUI/ResetModal';
import { useTranslation } from 'react-i18next';

interface ResetButtonProps {
    /**
     * Closes the drawer the button is in, then calls `then` once it's fully gone, which
     * opens the confirmation. On iOS a drawer is a modal, and opening the confirmation
     * while it was still closing presented it on the way-out drawer: it went down with
     * it, left an invisible modal over the whole app that swallowed every tap, and the
     * game was never reset. Without it, the confirmation opens straight away
     */
    onPress?: (then: () => void) => void;
}

/** Opens the confirmation that resets the game (see ResetModal) */
export default function ResetButton({ onPress }: ResetButtonProps) {
    const { t } = useTranslation();
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("drawer.resetGame")}
            onPress={() => {
                if (onPress) onPress(openResetConfirm);
                else openResetConfirm();
            }}
            style={({ pressed }) => [styles.button, pressed ? { opacity: 0.7 } : null]}
        >
            <Text size={18} style={{ lineHeight: 24 }}>🗑️</Text>
            <Text font="black" size={14} color={palette.pop}>{t("drawer.resetGame")}</Text>
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
