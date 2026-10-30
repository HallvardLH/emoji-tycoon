import { View, StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import Text from "../../generalUI/Text";
import { updateBuildingSort, BuildingSort } from "../../../scripts/redux/preferencesSlice";
import { RootState } from '../../../scripts/redux/reduxStore';
import { palette, radii, themedStyles } from "../../misc/theme";
import { useTranslation } from "react-i18next";

const options: BuildingSort[] = ["shop", "value"];

/** The order of the building list, under the bulk buy options and matching them */
export default function BuildingSortToggle() {
    const sort = useSelector((state: RootState) => state.preferences.buildingSort) ?? "shop";
    const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text font="bold" size={13} color={palette.lilac}>{t("buildings.sortLabel")}</Text>
            <View style={styles.options} accessibilityRole="radiogroup">
                {options.map(option => {
                    const active = sort === option;
                    return (
                        <Pressable
                            key={option}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: active }}
                            accessibilityHint={option === "value" ? t("buildings.sortValueHint") : undefined}
                            onPress={() => dispatch(updateBuildingSort(option))}
                            style={[styles.option, active ? styles.optionActive : null]}
                        >
                            <Text size={15} color={active ? palette.ink : "#FFFFFF"} numberOfLines={1}>{t(`buildings.sort.${option}`)}</Text>
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
        gap: 12,
    },
    // Long labels in some languages shrink the options rather than push off the screen
    options: {
        flexDirection: "row",
        flexShrink: 1,
        gap: 6,
    },
    option: {
        flexShrink: 1,
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
