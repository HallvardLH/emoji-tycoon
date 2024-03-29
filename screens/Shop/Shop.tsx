import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BuildingsList from "../../components/gameUI/BuildingsList";
import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";
import ContentTab from "../../components/layout/ContentTab";
import Buildings from "./Buildings";
import Upgrades from "./Upgrades";

interface ShopProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Shop({ navigation }: ShopProps) {
    return (
        <ScreenView>
            <ContentTab
                tabs={[
                    {
                        name: "Buildings",
                        component: <Buildings />
                    },
                    {
                        name: "Upgrades",
                        component: <Upgrades />
                    }
                ]}
            />
        </ScreenView>
    )
}