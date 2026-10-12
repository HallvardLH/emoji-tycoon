import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { updateReduceAnimations, updateSoundEffects } from '../../scripts/redux/preferencesSlice';
import SwitchRow from './SwitchRow';
import ResetButton from './ResetButton';
import Text from '../generalUI/Text';
import { palette } from '../misc/theme';

interface SettingsProps {
    /** Called when the reset button is pressed, to close the drawer */
    onReset?: () => void;
}

export default function Settings({ onReset }: SettingsProps) {
    const dispatch = useDispatch();
    const reduceAnimations = useSelector((state: RootState) => state.preferences.reduceAnimations ?? false);
    const soundEffects = useSelector((state: RootState) => state.preferences.soundEffects ?? true);

    return (
        <View style={styles.container}>
            <Text size={30}>Settings</Text>

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>SOUND</Text>
                <SwitchRow
                    icon="🔔"
                    label="Sound effects"
                    hint="A soft pop as you tap, and a chime for shiny emojis."
                    value={soundEffects}
                    onChange={value => dispatch(updateSoundEffects(value))}
                />
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

            <View style={styles.section}>
                <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>DANGER ZONE</Text>
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
