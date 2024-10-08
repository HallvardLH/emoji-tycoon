import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import ContentTab from "../../components/layout/ContentTab";
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import BuyUpgrades from "./BuyUpgrades";
import OwnedUpgrades from "./OwnedUpgrades";

interface UpgradesProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Upgrades({ navigation }: UpgradesProps) {

    return (
        <ScreenView scrollView={false}>
            <ContentTab
                contentSpacing={5}
                tabs={[
                    {
                        name: "Upgrades",
                        component: <BuyUpgrades />
                    },
                    {
                        name: "Owned",
                        component: <OwnedUpgrades />,
                    }
                ]}
            />
        </ScreenView>
    )
}