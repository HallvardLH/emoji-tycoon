import ScreenView from "../components/layout/ScreenView";
import React from 'react';
import BuildingsList from "../components/gameUI/BuildingsList";
import ScrollToTopView from "../components/layout/ScrollToTopView";
import { View } from "react-native";

interface ShopProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Shop({ navigation }: ShopProps) {
    return (
        <ScreenView>
            <View style={{ width: "100%" }}>
                <ScrollToTopView>
                    <BuildingsList />
                </ScrollToTopView>
            </View>
        </ScreenView>
    )
}