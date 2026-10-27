import { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import Text from "../generalUI/Text";
import Badge from "../generalUI/Badge";
import { palette, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";
import { getLanguage } from "../../i18n";

interface TabButtonProps {
    label: string;
    onPress?: () => void;
    icon: string;
    notifications?: number;
    active?: boolean;
}

/** One tab: the icon grows and brightens when active (the bar slides its highlight behind it) */
export default function TabButton({ label, onPress, icon, notifications, active }: TabButtonProps) {
    const { t } = useTranslation();
    const focus = useRef(new Animated.Value(active ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(focus, { toValue: active ? 1 : 0, friction: 6, tension: 120, useNativeDriver: true }).start();
    }, [active]);
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={notifications ? t("tabs.newItemsLabel", { label, count: notifications }) : label}
            style={styles.container}
        >
            <View>
                <Animated.View style={{
                    opacity: focus.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
                    transform: [
                        { scale: focus.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] }) },
                        { translateY: focus.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
                    ],
                }}>
                    <Text size={28} style={styles.emoji}>{icon}</Text>
                </Animated.View>
                {!active && notifications ? (
                    <Badge value={notifications} ringColor={palette.night} style={styles.badge} />
                ) : null}
            </View>
            <Text font="black" size={11} color={active ? palette.sun : palette.lilac} style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{label.toLocaleUpperCase(getLanguage())}</Text>
        </Pressable>
    )
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flex: 1,
        height: 62,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    emoji: {
        lineHeight: 34,
    },
    label: {
        letterSpacing: 0.8,
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -14,
    },
}))
