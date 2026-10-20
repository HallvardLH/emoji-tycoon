import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Emoji from "../Emoji";
import ContentBox from "../../generalUI/ContentBox";
import Text from "../../generalUI/Text";
import Button from "../../buttons/Button";
import { colors } from "../../misc/Colors";
import { formatNumber } from "../../../scripts/misc";
import { getUpgradeBonus } from "../../../scripts/game/upgrades/upgrades";
import { howFun } from "../../../scripts/game/shorthands";
import { useSelector } from 'react-redux';
import { RootState } from "../../../scripts/redux/reduxStore";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

interface UpgradeListItemProps {
    /** The displayed, translated, name */
    name: string;
    /** The displayed, translated, building name */
    buildingName?: string;
    buildingIcon?: string;
    id: number;
    description: string;
    quote?: string;
    effect: string;
    price: number;
    icon: string;
    buttonActive: boolean;
    onPress: () => void;
    onEmojiPress?: () => void;
}

export default function UpgradeListItem(props: UpgradeListItemProps) {
    const { name, buildingName, buildingIcon, id, description, quote, effect, price, icon, buttonActive, onPress, onEmojiPress } = props;

    const { bonuses, bonusPercentages, kinds } = getUpgradeBonus(id);
    const { t } = useTranslation();

    // const { showDetails } = useSelector((state: RootState) => state.preferences);

    const [showDetails, setShowDetails] = useState(false);
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
                    <Emoji size={24} icon={buildingIcon ?? ""} />
                    <Text shadow={false} color={colors.yellow.highlight} size={14}>{buildingName}</Text>
                </View>
            )}
            <View style={listItemStyles.container}>
                {onEmojiPress ? (
                    <TouchableOpacity style={listItemStyles.left} onPress={onEmojiPress}>
                        <Emoji icon={icon} />
                    </TouchableOpacity>
                ) : (
                    <View style={listItemStyles.left}>
                        <Emoji icon={icon} />
                    </View>
                )}
                <View style={listItemStyles.center}>
                    <Text shadow={false} color={colors.yellow.highlight} size={20}>{name}</Text>
                    <Text shadow={false} color={colors.purple.medium} size={16}>
                        {howFun(77) ? "💸" : "💵"} {formatNumber(price)}</Text>
                    {quote && (
                        <Text style={{ letterSpacing: 0.1, }} shadow={false} color={colors.pink.dark} size={13}>
                            <Text shadow={false} color={colors.pink.highlight} size={15}>"</Text>
                            {quote}
                            <Text shadow={false} color={colors.pink.highlight} size={15}>"</Text>
                        </Text>
                    )}
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={"gray"} size={14}>{description}</Text>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.purple.medium} size={14}>{effect}</Text>
                </View>

            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center"
            }}>
                <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={110} variant={"blue"} label={t("common.buy")} />
                <Button onPress={() => setShowDetails(!showDetails)} down={showDetails} shadowHeight={8} height={34} width={110} variant="submit" label={t("common.details")} />

            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center"
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>

                    {showDetails && (
                        <>
                            {bonuses.map((bonus, index) => (
                                <React.Fragment key={index}>
                                    <Text style={{ textAlign: "center" }} shadow={false} color={"gray"} size={14}>
                                        <Trans
                                            i18nKey={kinds[index] === "tap" ? "upgrades.bonusTap" : "upgrades.bonusProduction"}
                                            values={{ bonus: bonus, percent: bonusPercentages[index] }}
                                            components={{ hl: <Text shadow={false} color={colors.purple.dark} size={14} /> }}
                                        />
                                    </Text>
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </View>
            </View>
        </ContentBox >
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
        flexBasis: 0,
        backgroundColor: "red",
        alignItems: "center",
    },
})