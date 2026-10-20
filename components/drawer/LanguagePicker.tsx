import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { setLanguage } from "../../scripts/redux/preferencesSlice";
import { languageNames, supportedLanguages, LanguagePreference } from "../../i18n";
import Button from "../buttons/Button";
import Text from "../generalUI/Text";

export default function LanguagePicker() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selected = useSelector((state: RootState) => state.preferences.language) ?? "system";

    const select = (language: LanguagePreference) => {
        dispatch(setLanguage(language));
    };

    return (
        <View style={{
            alignItems: "center",
            gap: 10,
        }}>
            <Text size={25}>{t("drawer.language")}</Text>
            <Button
                width={250}
                height={40}
                variant={selected === "system" ? "pink" : "blue"}
                down={selected === "system"}
                label={t("drawer.deviceLanguage")}
                onPress={() => select("system")}
            />
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                width: 250,
                gap: 10,
            }}>
                {supportedLanguages.map(language => (
                    <Button
                        key={language}
                        width={120}
                        height={40}
                        variant={selected === language ? "pink" : "blue"}
                        down={selected === language}
                        label={languageNames[language]}
                        onPress={() => select(language)}
                    />
                ))}
            </View>
        </View>
    )
}
