import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import { buildingData } from '../../../scripts/game/buildings/buildingData';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Emoji from '../Emoji';
import Text from '../../generalUI/Text';
import { BuildingInfo } from '../Buildings/BuildingsList';
import { BuildingNames } from '../../../scripts/game/buildings/buildingNamesType';
import { toggleUpgradeFilter } from '../../../scripts/redux/preferencesSlice';
import store from '../../../scripts/redux/reduxStore';
import Modal from '../../generalUI/Modal';
import { useState } from 'react';
import ContentBox from '../../generalUI/ContentBox';
import CircularButton from '../../buttons/CircularButton';
import { upgradeFilters } from '../../../scripts/redux/preferencesSlice';
import { colors } from '../../misc/Colors';

interface UpgradesListFilterProps {
    selected: upgradeFilters[]
}

export default function UpgradesListFilter({ selected }: UpgradesListFilterProps) {
    const { buildings } = useSelector((state: RootState) => state.buildings);

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <CircularButton onPress={() => setModalVisible(true)} />
            <Modal
                modalVisible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ContentBox title="Filter upgrades">
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text shadow={false} color={colors.yellow.dark} size={14} style={{ textAlign: "center" }}>Select which buildings to see upgrades for.</Text>
                    </View>
                    <View style={styles.container}>
                        {/* <TouchableOpacity onPress={() => { store.dispatch(toggleUpgradeFilter("all")) }}>
                            <View style={selected.includes("all") ? styles.selected : null} key={"all"}>
                                <Emoji size={25} icon={"🌎"} />
                            </View>
                        </TouchableOpacity> */}
                        {buildingData.map((building: BuildingInfo) => {
                            const dynamicData = buildings[building.buildingId];
                            return (
                                <>
                                    {dynamicData.unlocked && (
                                        <TouchableOpacity onPress={() => { store.dispatch(toggleUpgradeFilter(building.name as BuildingNames)) }}>
                                            <View style={[styles.upgrade, selected.includes(building.name as upgradeFilters) ? styles.selected : null]} key={building.name}>
                                                <Emoji size={30} icon={building.icon} />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </>
                            );
                        })}
                    </View>
                </ContentBox>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        flexWrap: "wrap",
        paddingHorizontal: 30,
    },

    upgrade: {
        borderWidth: 3.5,
        borderRadius: 100,
        padding: 5,
        borderColor: "gray",
    },

    selected: {
        backgroundColor: colors.blue.light,
        borderColor: colors.blue.medium,
    }
})