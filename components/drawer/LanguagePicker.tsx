import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { setLanguage } from "../../scripts/redux/preferencesSlice";
import { languageNames, supportedLanguages, LanguagePreference } from "../../i18n";
import Button from "../buttons/Button";
import Text from "../generalUI/Text";
import Modal from "../generalUI/Modal";
import ContentBox from "../generalUI/ContentBox";

export default function LanguagePicker() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selected = useSelector((state: RootState) => state.preferences.language) ?? "system";
    const [modalVisible, setModalVisible] = useState(false);

    const getLabel = (language: LanguagePreference) =>
        language === "system" ? t("drawer.deviceLanguage") : languageNames[language];

    const options: LanguagePreference[] = ["system", ...supportedLanguages];

    const select = (language: LanguagePreference) => {
        setModalVisible(false);
        dispatch(setLanguage(language));
    };

    return (
        <View style={{
            alignItems: "center",
            gap: 10,
        }}>
            <Text size={25}>{t("drawer.language")}</Text>
            <Button width={200} variant="blue" label={getLabel(selected)} onPress={() => setModalVisible(true)} />
            <Modal
                modalVisible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ContentBox title={t("drawer.language")}>
                    <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ alignItems: "center", gap: 10, paddingVertical: 10 }}>
                        {options.map(language => (
                            <Button
                                key={language}
                                width={220}
                                height={40}
                                variant={selected === language ? "pink" : "blue"}
                                down={selected === language}
                                label={getLabel(language)}
                                onPress={() => select(language)}
                            />
                        ))}
                    </ScrollView>
                </ContentBox>
            </Modal>
        </View>
    )
}
