import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { updateReduceAnimations, updateSoundEffects } from '../../scripts/redux/preferencesSlice';
import SwitchRow from './SwitchRow';
import ResetButton from './ResetButton';
import Text from '../generalUI/Text';
import { palette } from '../misc/theme';
import LanguagePicker from './LanguagePicker';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '../../i18n';

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

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{caps(t("settings.dangerZone"))}</Text>
                <ResetButton onPress={onReset} />
            </View>
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
});
