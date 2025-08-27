import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import ContentTab from "../../components/layout/ContentTab";
import Collection from "../../screens/Emojidex/Collection";
import Stats from "../../screens/Emojidex/Stats";
import Upgrades from "../../screens/Emojidex/Upgrades";

export default function Emojidex() {
    return (
        <ScreenView scrollView={false}>
            <ContentTab
                tabs={[
                    {
                        name: "Upgrades",
                        component: <Upgrades />,
                    },
                    {
                        name: "Stats",
                        component: <Stats />,
                    },
                    {
                        name: "Collection",
                        component: <Collection />
                    }
                ]}
            />
        </ScreenView>
    )

}