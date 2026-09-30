import { useDispatch } from 'react-redux';
import { resetValues } from '../../scripts/redux/valuesSlice';
import { resetBuildings } from '../../scripts/redux/buildingsSlice';
import { resetUpgrades } from '../../scripts/redux/upgradesSlice';
import { resetBigEmoji } from '../../scripts/redux/bigEmojiSlice';
import { resetEffects } from '../../scripts/redux/effectsSlice';
import { resetCollection } from '../../scripts/redux/collectionSlice';
import { resetPreferences } from '../../scripts/redux/preferencesSlice';
import { resetStats } from '../../scripts/redux/statsSlice';
import { resetPrestige } from '../../scripts/redux/prestigeSlice';
import { resetTabs } from '../../scripts/redux/tabsSlice';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Text from '../generalUI/Text';
import { palette, radii } from '../misc/theme';

interface ResetButtonProps {
    onPress?: () => void;
}

// How long the "tap again" confirmation stays armed
const CONFIRM_MS = 3000;

export default function ResetButton({ onPress }: ResetButtonProps) {
    const dispatch = useDispatch();
    // Resetting wipes the save, so it takes a second tap to confirm
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        if (!armed) return;
        const timeout = setTimeout(() => setArmed(false), CONFIRM_MS);
        return () => clearTimeout(timeout);
    }, [armed]);

    const handleReset = () => {
        dispatch(resetValues());
        dispatch(resetBuildings());
        dispatch(resetUpgrades());
        dispatch(resetBigEmoji());
        dispatch(resetEffects());
        dispatch(resetCollection());
        dispatch(resetPreferences());
        dispatch(resetStats());
        dispatch(resetPrestige());
        dispatch(resetTabs());
    };
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={armed ? "Tap again to reset the game" : "Reset game"}
            onPress={() => {
                if (!armed) {
                    setArmed(true);
                    return;
                }
                setArmed(false);
                handleReset();
                if (onPress) {
                    onPress();
                }
            }}
            style={({ pressed }) => [styles.button, armed ? styles.armed : null, pressed ? { opacity: 0.7 } : null]}
        >
            <Text size={18} style={{ lineHeight: 24 }}>{armed ? "⚠️" : "🗑️"}</Text>
            <Text font="black" size={14} color={armed ? "#FFFFFF" : palette.pop}>
                {armed ? "Tap again to reset everything" : "Reset game"}
            </Text>
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
    armed: {
        backgroundColor: palette.pop,
    },
})