import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { updateReduceAnimations, updateSoundEffects, updateVibration } from '../../scripts/redux/preferencesSlice';
import SwitchRow from './SwitchRow';
import ResetButton from './ResetButton';
import Text from '../generalUI/Text';
import { palette, radii } from '../misc/theme';
import { privacyOptionsRequired, showPrivacyOptions } from '../../scripts/ads';
import { ADS_ENABLED } from '../../scripts/monetization';

interface SettingsProps {
    /** Called when the reset button is pressed, to close the drawer */
    onReset?: () => void;
}

export default function Settings({ onReset }: SettingsProps) {
    const dispatch = useDispatch();
    const reduceAnimations = useSelector((state: RootState) => state.preferences.reduceAnimations ?? false);
    const soundEffects = useSelector((state: RootState) => state.preferences.soundEffects ?? true);
    const vibration = useSelector((state: RootState) => state.preferences.vibration ?? true);
    // Where the law asks for it, players can change their ad consent at any time
    const [showPrivacy, setShowPrivacy] = useState(false);
    useEffect(() => {
        // No ads, no consent to ask for
        if (!ADS_ENABLED) return;
        let cancelled = false;
        privacyOptionsRequired().then(required => { if (!cancelled) setShowPrivacy(required); });
        return () => { cancelled = true; };
    }, []);

    return (
        <View style={styles.container}>
            <Text size={30}>Settings</Text>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>SOUND AND VIBRATION</Text>
                <SwitchRow
                    icon="🔔"
                    label="Sound effects"
                    hint="A soft pop as you tap, and a chime for shiny emojis."
                    value={soundEffects}
                    onChange={value => dispatch(updateSoundEffects(value))}
                />
                {/* Phones only: browsers don't vibrate for the game */}
                {Platform.OS !== "web" && (
                    <SwitchRow
                        icon="📳"
                        label="Vibration"
                        hint="A buzz as you tap, buy and celebrate."
                        value={vibration}
                        onChange={value => dispatch(updateVibration(value))}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>PERFORMANCE</Text>
                <SwitchRow
                    icon="🐢"
                    label="Reduce animations"
                    hint="Tapped emojis no longer fly off the Big Emoji. Try this if tapping feels laggy."
                    value={reduceAnimations}
                    onChange={value => dispatch(updateReduceAnimations(value))}
                />
            </View>

            {showPrivacy && (
                <View style={styles.section}>
                    <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>PRIVACY</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Privacy choices"
                        onPress={showPrivacyOptions}
                        style={({ pressed }) => [styles.row, pressed ? { opacity: 0.7 } : null]}
                    >
                        <Text size={18} style={{ lineHeight: 24 }}>🛡️</Text>
                        <View style={styles.rowText}>
                            <Text font="bold" size={14}>Privacy choices</Text>
                            <Text font="bold" size={12} color={palette.lilac}>Change how ads may use your data.</Text>
                        </View>
                        <Text font="black" size={18} color={palette.lilac}>›</Text>
                    </Pressable>
                </View>
            )}

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>DANGER ZONE</Text>
                <ResetButton onPress={onReset} />
            </View>

            <Text font="bold" size={12} color={palette.lilac} style={styles.version}>
                Emoji Tycoon {Constants.expoConfig?.version ?? ""}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingHorizontal: 20,
        gap: 20,
    },
    section: {
        gap: 8,
    },
    sectionTitle: {
        letterSpacing: 1.3,
    },
    row: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
    },
    rowText: {
        flex: 1,
        gap: 2,
    },
    version: {
        textAlign: "center",
        opacity: 0.7,
    },
});
