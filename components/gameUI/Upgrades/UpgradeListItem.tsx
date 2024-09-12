import React from "react";
import { View, StyleSheet } from "react-native";
import Emoji from "../Emoji";
import ContentBox from "../../generalUI/ContentBox";
import Text from "../../generalUI/Text";
import Button from "../../buttons/Button";
import { colors } from "../../misc/Colors";
import { formatNumber } from "../../../scripts/misc";
import { getUpgradeBonus } from "../../../scripts/game/upgrades/upgrades";
import { buildingEmojis } from "../../../scripts/game/buildings/buildings";

interface UpgradeListItemProps {
    name: string;
    buildingName: string | undefined;
    id: number;
    description: string;
    effect: string;
    price: number;
    icon: string;
    buttonActive: boolean;
    onPress: () => void;
}

export default function UpgradeListItem(props: UpgradeListItemProps) {
    const { name, buildingName, id, description, effect, price, icon, buttonActive, onPress } = props;
    const [bonuses, bonusPercentages] = getUpgradeBonus(id);
    return (
        <ContentBox style={{ marginBottom: 32 }}>
            {buildingName && (
                <View style={{
                    position: "absolute",
                    top: -30,
                    left: 6,
                    backgroundColor: "white",
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <Emoji size={24} icon={buildingEmojis[buildingName]} />
                    <Text shadow={false} color={colors.yellow.highlight} size={14}>{buildingName}</Text>
                </View>
            )}
            <View style={listItemStyles.container}>
                <View style={listItemStyles.left}>
                    <Emoji icon={icon} />
                </View>
                <View style={listItemStyles.center}>
                    <Text shadow={false} color={colors.yellow.highlight} size={20}>{name}</Text>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.yellow.highlight} size={15}>{description}</Text>
                </View>
                <View style={listItemStyles.right}>
                    {/* <Text style={{ lineHeight: 30 }} shadow={false} size={amountFontSize} color={colors.purple.medium}>{amount}</Text> */}
                    <Text style={{ textAlign: "center", lineHeight: 15 }} shadow={false} color={colors.purple.medium} size={14}>{formatNumber(price)} 💵</Text>
                </View>
            </View>
            <View style={{
                flexDirection: "row",
                // gap: 10,
                justifyContent: "space-between",
                marginHorizontal: 10,
                gap: 10
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.purple.medium} size={15}>{effect}</Text>
                    {bonuses.map((bonus, index) => (
                        <React.Fragment key={index}>
                            <Text shadow={false} color={colors.purple.dark} size={15}>
                                <Text shadow={false} color={"gray"} size={15}>+{bonus}</Text> eps <Text shadow={false} color={"gray"} size={15}>+{bonusPercentages[index]}</Text>
                            </Text>
                        </React.Fragment>
                    ))}
                </View>
                <View style={{
                    flexBasis: 90,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                }}>
                    <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={90} variant={"blue"} label={"Buy"} />
                    {/* <Button shadowHeight={8} onPress={() => setShowDetails(!showDetails)} height={34} width={90} variant="submit" label={"Details"} /> */}

                </View>

            </View>
        </ContentBox>
    )
}

const listItemStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10,
        marginTop: 8,
    },

    left: {
        flexBasis: 56,
        gap: 12,
        alignItems: "center",
    },

    center: {
        flex: 1,
    },

    right: {
        flexBasis: 56,
        alignItems: "center",
    },
})