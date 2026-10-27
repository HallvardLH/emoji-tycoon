import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { updateReduceAnimations, updateSoundEffects, updateVibration } from '../../scripts/redux/preferencesSlice';
import SwitchRow from './SwitchRow';
import ResetButton from './ResetButton';
import Text from '../generalUI/Text';
import { palette, radii, themedStyles } from '../misc/theme';
import LanguagePicker from './LanguagePicker';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '../../i18n';
import { privacyOptionsRequired, showPrivacyOptions } from '../../scripts/ads';
import { ADS_ENABLED } from '../../scripts/monetization';

interface SettingsProps {
    /** Called when the reset button is pressed, to close the drawer */
    onReset?: () => void;
}

export default function Settings({ onReset }: SettingsProps) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const caps = (text: string) => text.toLocaleUpperCase(getLanguage());
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
            <Text size={30}>{t("settings.title")}</Text>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("drawer.language"))}</Text>
                <LanguagePicker />
            </View>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("settings.sound"))}</Text>
                <SwitchRow
                    icon="🔔"
                    label={t("settings.soundEffects")}
                    hint={t("settings.soundEffectsHint")}
                    value={soundEffects}
                    onChange={value => dispatch(updateSoundEffects(value))}
                />
                {/* Phones only: browsers don't vibrate for the game */}
                {Platform.OS !== "web" && (
                    <SwitchRow
                        icon="📳"
                        label={t("settings.vibration")}
                        hint={t("settings.vibrationHint")}
                        value={vibration}
                        onChange={value => dispatch(updateVibration(value))}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("settings.performance"))}</Text>
                <SwitchRow
                    icon="🐢"
                    label={t("settings.reduceAnimations")}
                    hint={t("settings.reduceAnimationsHint")}
                    value={reduceAnimations}
                    onChange={value => dispatch(updateReduceAnimations(value))}
                />
            </View>

            {showPrivacy && (
                <View style={styles.section}>
                    <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("settings.privacy"))}</Text>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t("settings.privacyChoices")}
                        onPress={showPrivacyOptions}
                        style={({ pressed }) => [styles.row, pressed ? { opacity: 0.7 } : null]}
                    >
                        <Text size={18} style={{ lineHeight: 24 }}>🛡️</Text>
                        <View style={styles.rowText}>
                            <Text font="bold" size={14}>{t("settings.privacyChoices")}</Text>
                            <Text font="bold" size={12} color={palette.lilac}>{t("settings.privacyHint")}</Text>
                        </View>
                        <Text font="black" size={18} color={palette.lilac}>›</Text>
                    </Pressable>
                </View>
            )}

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("settings.dangerZone"))}</Text>
                <ResetButton onPress={onReset} />
            </View>

            <Text font="bold" size={12} color={palette.lilac} style={styles.version}>
                Emoji Tycoon {Constants.expoConfig?.version ?? ""}
            </Text>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
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
}));
