import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import ContentTab from "../../components/layout/ContentTab";
import Collection from "./Collection";
import Stats from "./Stats";

interface EmojidexProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Emojidex({ navigation }: EmojidexProps) {
    return (
        <ScreenView>
            <ContentTab
                tabs={[
                    {
                        name: "Achievements",
                        component: <Stats />,
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