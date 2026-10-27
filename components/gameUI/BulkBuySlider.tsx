import { View, StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import Text from "../generalUI/Text";
import { updateBulkBuy, BulkBuyAmount } from "../../scripts/redux/preferencesSlice";
import { RootState } from '../../scripts/redux/reduxStore';
import { palette, radii, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";

const options: { value: BulkBuyAmount, label: string }[] = [
    { value: 1, label: "×1" },
    { value: 10, label: "×10" },
    { value: 100, label: "×100" },
    // Translated when shown
    { value: "max", label: "Max" },
];

/** How many buildings each Buy press buys */
export default function BulkBuySlider() {
    const { bulkBuy } = useSelector((state: RootState) => state.preferences);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text font="bold" size={13} color={palette.lilac}>{t("buildings.bulkLabel")}</Text>
            <View style={styles.options} accessibilityRole="radiogroup">
                {options.map(option => {
                    const active = bulkBuy === option.value;
                    return (
                        <Pressable
                            key={option.label}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: active }}
                            accessibilityLabel={option.value === "max" ? t("buildings.bulkA11yMax") : t("buildings.bulkA11y", { count: option.value })}
                            onPress={() => dispatch(updateBulkBuy(option.value))}
                            style={[styles.option, active ? styles.optionActive : null]}
                        >
                            <Text size={15} color={active ? palette.ink : "#FFFFFF"}>{option.value === "max" ? t("buildings.bulkMax") : option.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    options: {
        flexDirection: "row",
        gap: 6,
    },
    option: {
        minWidth: 44,
        height: 34,
        paddingHorizontal: 12,
        borderRadius: radii.sm,
        backgroundColor: palette.glass,
        alignItems: "center",
        justifyContent: "center",
    },
    optionActive: {
        backgroundColor: palette.sun,
    },
}));
