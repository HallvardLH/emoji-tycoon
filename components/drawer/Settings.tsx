import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { updateReduceAnimations } from '../../scripts/redux/preferencesSlice';
import SwitchRow from './SwitchRow';
import Text from '../generalUI/Text';
import { palette } from '../misc/theme';

export default function Settings() {
    const dispatch = useDispatch();
    const reduceAnimations = useSelector((state: RootState) => state.preferences.reduceAnimations ?? false);

    return (
        <View style={styles.container}>
            <Text size={30}>Settings</Text>

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
