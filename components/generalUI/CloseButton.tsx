import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { palette, radii, themedStyles } from "../misc/theme";
import i18n from "../../i18n";

interface CloseButtonProps {
    onPress?: () => void;
    size?: number;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}

/**
 * Closes a modal or screen: a frosted square with a bold ✕, like the header's
 * buttons. Keep it inside its parent's bounds: Android doesn't pass on taps to
 * anything that hangs outside them
 */
export default function CloseButton({ onPress, size = 40, accessibilityLabel = i18n.t("common.close"), style }: CloseButtonProps) {
    const cross = Math.round(size * 0.34);
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            hitSlop={8}
            style={({ pressed }) => [
                styles.button,
                { width: size, height: size },
                pressed ? styles.pressed : null,
                style,
            ]}
        >
            <Svg width={cross} height={cross} viewBox="0 0 12 12">
                <Path d="M2 2 L10 10 M10 2 L2 10" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
            </Svg>
        </Pressable>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    button: {
        borderRadius: radii.md,
        backgroundColor: palette.glass,
        borderWidth: 1,
        borderColor: palette.glassLine,
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.94 }],
    },
}));
