import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { setLanguage } from "../../scripts/redux/preferencesSlice";
import { languageNames, supportedLanguages, LanguagePreference } from "../../i18n";
import Text from "../generalUI/Text";
import { palette, radii } from "../misc/theme";

/**
 * A settings row showing the language, which opens a list of every language below it.
 * A list in place rather than a modal, as a modal opened from the drawer ends up behind it
 */
export default function LanguagePicker() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // Older saves have no language preference
    const selected = useSelector((state: RootState) => state.preferences.language) ?? "system";
    const [open, setOpen] = useState(false);

    const getLabel = (language: LanguagePreference) =>
        language === "system" ? t("drawer.deviceLanguage") : languageNames[language];

    const options: LanguagePreference[] = ["system", ...supportedLanguages];

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => setOpen(!open)}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={t("drawer.language")}
                style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
            >
                <Text size={18} style={styles.icon}>🌐</Text>
                <View style={styles.text}>
                    <Text font="bold" size={14}>{t("drawer.language")}</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{getLabel(selected)}</Text>
                </View>
                <Text font="black" size={14} color={palette.lilac}>{open ? "▲" : "▼"}</Text>
            </Pressable>

            {open && (
                <View style={styles.list}>
                    {options.map(language => {
                        const isSelected = language === selected;
                        return (
                            <Pressable
                                key={language}
                                onPress={() => {
                                    setOpen(false);
                                    // The app remounts in the new language, see app/_layout.tsx
                                    dispatch(setLanguage(language));
                                }}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: isSelected }}
                                style={({ pressed }) => [styles.option, isSelected ? styles.optionSelected : null, pressed ? styles.pressed : null]}
                            >
                                <Text font="bold" size={14} color={isSelected ? palette.ink : palette.paper}>{getLabel(language)}</Text>
                                {isSelected ? <Text font="black" size={14} color={palette.ink}>✓</Text> : null}
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 6,
    },
    // Matches SwitchRow
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
    pressed: {
        opacity: 0.7,
    },
    icon: {
        lineHeight: 24,
    },
    text: {
        flex: 1,
        gap: 2,
    },
    list: {
        gap: 4,
    },
    option: {
        minHeight: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
    },
    optionSelected: {
        backgroundColor: palette.sun,
    },
});
