import { StyleSheet, View } from "react-native";
import Text from "../../generalUI/Text";
import Button from "../../buttons/Button";
import ContentBox from "../../generalUI/ContentBox";
import Emoji from "../Emoji";
import { colors } from "../../misc/Colors";
import { useState } from "react";
import { buildingData } from "../../../scripts/game/buildings/buildingData";
import { getBuildingNameForAmount } from "../../../i18n/content";
import { Trans, useTranslation } from "react-i18next";
import DisplayUpgrades from "../DisplayUpgrades";
import { formatNumber } from "../../../scripts/misc";
import { howFun } from "../../../scripts/game/shorthands";

interface BuildingListItemProps {
    buildingId: number;
    /** The displayed, translated, name */
    name: string;
    icon: string;
    description: string;
    price: number | string;
    baseEps: number;
    upgradeAmount: number;
    eps: number;
    amount: number;
    buttonActive?: boolean;
    onPress: () => void;
}

export default function BuildingListItem(props: BuildingListItemProps) {
    const {
        buildingId,
        name,
        icon,
        description,
        price,
        baseEps,
        upgradeAmount,
        eps,
        amount,
        buttonActive = true,
        onPress,
    } = props;

    const [showDetails, setShowDetails] = useState(false);
    const { t } = useTranslation();

    const highlight = <Text shadow={false} color={colors.yellow.highlight} size={15} />;

    return (
        <ContentBox style={{ marginBottom: 18 }}>
            <View style={listItemStyles.container}>
                <View style={listItemStyles.left}>
                    <Emoji icon={icon} />
                </View>
                <View style={listItemStyles.center}>
                    <Text shadow={false} color={colors.purple.dark} size={20}>{name}</Text>
                    {/* <Text style={{ letterSpacing: 0.5, marginVertical: -4 }} shadow={false} color={colors.blue.medium} size={14}>Produces {formatNumber(baseEps)} eps</Text> */}
                    <Text shadow={false} color={colors.yellow.highlight} size={16}>{howFun(77) ? "💸" : "💵"} {price}</Text>
                    {eps > 0 && (
                        <Text style={{ lineHeight: 14 }} shadow={false} color={colors.purple.dark} size={14}>
                            <Trans
                                i18nKey="buildings.emojisPerSecond"
                                values={{ eps: formatNumber(eps) }}
                                components={{ hl: <Text style={{ lineHeight: 14 }} shadow={false} color={colors.yellow.highlight} size={14} /> }}
                            />
                        </Text>
                    )}
                    <Text style={{ letterSpacing: 0.05 }} shadow={false} color={"gray"} size={14}>{description}</Text>
                </View>
                <View style={listItemStyles.right}>
                    <Text style={{ lineHeight: 30 }} shadow={false} size={amount < 1000 ? 30 : 26} color={colors.purple.medium}>{amount}</Text>
                    <Text style={{ lineHeight: 15 }} shadow={false} color={colors.purple.medium} size={14}>{t("common.owned", { count: amount })}</Text>
                </View>
            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center"
            }}>
                <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={110} variant={"blue"} label={t("common.buy")} />
                <Button shadowHeight={8} onPress={() => setShowDetails(!showDetails)} down={showDetails} height={34} width={110} variant="submit" label={t("common.details")} />
            </View>
            {showDetails && (
                <View style={{
                    marginHorizontal: 10,
                }}>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        <Trans
                            i18nKey="buildings.youHave"
                            values={{ amount: formatNumber(amount), building: getBuildingNameForAmount(buildingId, amount) }}
                            components={{ hl: highlight }}
                        />
                    </Text>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        <Trans i18nKey="buildings.eachProduces" values={{ eps: formatNumber(baseEps) }} components={{ hl: highlight }} />
                    </Text>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        <Trans i18nKey="buildings.totalProduces" values={{ eps: formatNumber(eps) }} components={{ hl: highlight }} />
                    </Text>
                    {upgradeAmount > 0 && (
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 10,
                        }}>
                            <Text shadow={false} color={colors.purple.dark} size={20}>{t("buildings.ownedUpgrades")}</Text>
                            <DisplayUpgrades buildingName={buildingData[buildingId].name} />
                        </View>
                    )}
                </View>
            )}
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