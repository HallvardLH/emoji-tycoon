import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import CollectionList from "../../components/collection/CollectionList";

interface CollectionProps {
    navigation: {
        navigate: (name: string) => void;
    };
}

export default function Collection({ navigation }: CollectionProps) {
    const { notifications } = useSelector((state: RootState) => state.upgrades);
    return (
        <ScreenView scrollView={false}>
            <CollectionList />
        </ScreenView>
    )

}