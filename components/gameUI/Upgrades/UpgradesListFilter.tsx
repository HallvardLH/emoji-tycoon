import { useSelector } from 'react-redux';
import { RootState } from '../../../scripts/redux/reduxStore';
import { buildingData } from '../../../scripts/game/buildings/buildingData';
import { View } from 'react-native';
import Emoji from '../Emoji';
import Text from '../../generalUI/Text';
import { BuildingInfo } from '../Buildings/BuildingsList';

export default function UpgradesListFilter() {
    const { buildings } = useSelector((state: RootState) => state.buildings);
    return null
    return (
        <View style={{
            flexDirection: "row",
            // flex: 1,
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
            paddingHorizontal: 10,
        }}>
            {/* <View>
                <Emoji size={25} icon={"#"} />
            </View> */}

            {buildingData.map((building: BuildingInfo) => {
                const dynamicData = buildings[building.buildingId];
                return (
                    <>
                        {dynamicData.unlocked && (
                            <View key={building.name}>
                                <Emoji size={25} icon={building.icon} />
                            </View>
                            // <BuildingListItem
                            //     name={building.name}
                            //     key={building.name}
                            //     icon={building.icon}
                            //     description={building.description}
                            //     price={formatNumber(dynamicData.price)}
                            //     baseEps={building.baseEps * Math.pow(2, dynamicData.upgrades)}
                            //     upgradeAmount={dynamicData.upgrades}
                            //     eps={formatNumber(dynamicData.eps)}
                            //     amount={dynamicData ? dynamicData.amount : 0}
                            //     buttonActive={dynamicData.canBuy}
                            //     onPress={() => buyBuilding(building.name)}
                            // />
                        )}
                    </>
                );
            })}
        </View>
    )
}