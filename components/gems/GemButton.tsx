import { useEffect, useState } from "react";
import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { router } from "expo-router";
import Text from "../generalUI/Text";
import { GemBuyResult } from "../../scripts/game/gems/gemShop";
import { palette, radii, themedStyles } from "../misc/theme";
import * as Haptics from "../../scripts/game/haptics";
import { useGemStoreOpen } from "../../scripts/monetization";
import i18n from "../../i18n";

// How long a first tap waits for the second
const CONFIRM_MS = 3000;

interface GemButtonProps {
    cost: number;
    /** Spends the gems; "needGems" opens the gem store */
    onBuy: () => GemBuyResult;
    /** Shown before the price, e.g. "Buy now" */
    label?: string;
    disabled?: boolean;
    /** Replaces the price while disabled, e.g. "MAXED" */
    disabledLabel?: string;
    compact?: boolean;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}

/**
 * Spends gems on something. Takes a second tap to confirm, so gems are never spent by
 * accident; without enough gems it opens the gem store instead.
 */
export default function GemButton({ cost, onBuy, label, disabled, disabledLabel, compact, accessibilityLabel, style }: GemButtonProps) {
    const [armed, setArmed] = useState(false);
    // Already in the gem store: the packs are right there
    const inStore = useGemStoreOpen();

    useEffect(() => {
        if (!armed) return;
        const timeout = setTimeout(() => setArmed(false), CONFIRM_MS);
        return () => clearTimeout(timeout);
    }, [armed]);

    const onPress = () => {
        if (!armed) {
            setArmed(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            return;
        }
        setArmed(false);
        const result = onBuy();
        if (result === "needGems") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            if (!inStore) router.push("/gems");
        } else if (result === "bought") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const text = disabled
        ? disabledLabel ?? `💎 ${cost}`
        : armed ? `${i18n.t(compact ? "gemButton.confirmShort" : "gemButton.confirm")} 💎 ${cost}` : `${label ? `${label} ` : ""}💎 ${cost}`;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ? i18n.t("gemButton.labelA11y", { label: accessibilityLabel, cost }) : i18n.t("gemButton.costA11y", { cost })}
            accessibilityHint={armed ? i18n.t("gemButton.hint") : undefined}
            accessibilityState={{ disabled }}
            style={({ pressed }) => [
                styles.button,
                compact ? styles.compact : null,
                armed ? styles.armed : null,
                disabled ? styles.disabled : null,
                pressed && !disabled ? { opacity: 0.8 } : null,
                style,
            ]}
        >
            <Text font="black" size={compact ? 12 : 14} color={disabled ? palette.muted : armed ? palette.ink : "#FFFFFF"} numberOfLines={1}>
                {text}
            </Text>
        </Pressable>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    button: {
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: radii.pill,
        backgroundColor: "#2B7FD9",
        borderBottomWidth: 3,
        borderBottomColor: "#1B5AA3",
        alignItems: "center",
        justifyContent: "center",
    },
    compact: {
        minHeight: 28,
        paddingHorizontal: 6,
        borderBottomWidth: 2,
    },
    armed: {
        backgroundColor: palette.sun,
        borderBottomColor: palette.sunLedge,
    },
    disabled: {
        backgroundColor: palette.disabled,
        borderBottomColor: palette.disabled,
    },
}));
