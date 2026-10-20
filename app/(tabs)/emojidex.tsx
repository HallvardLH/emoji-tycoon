import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import ContentTab from "../../components/layout/ContentTab";
import Collection from "../../screens/Emojidex/Collection";
import Stats from "../../screens/Emojidex/Stats";
import Upgrades from "../../screens/Emojidex/Upgrades";
import { useTranslation } from "react-i18next";

export default function Emojidex() {
    const { t } = useTranslation();
    return (
        <ScreenView scrollView={false}>
            <ContentTab
                tabs={[
                    {
                        name: t("tabs.upgrades"),
                        component: <Upgrades />,
                    },
                    {
                        name: t("tabs.stats"),
                        component: <Stats />,
                    },
                    {
                        name: t("tabs.collection"),
                        component: <Collection />
                    }
                ]}
            />
        </ScreenView>
    )

}