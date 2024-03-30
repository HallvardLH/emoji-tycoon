import { View, StyleSheet } from "react-native";
import Emoji from "./Emoji";
import ContentBox from "../generalUI/ContentBox";
import Text from "../generalUI/Text";
import Button from "../buttons/Button";
import { colors } from "../misc/Colors";
import { formatNumber } from "../../scripts/misc";

interface UpgradeListItemProps {
    name: string;
    description: string;
    effect: string;
    price: number;
    icon: string;
    buttonActive: boolean;
    onPress: () => void;
}

export default function UpgradeListItem(props: UpgradeListItemProps) {
    const { name, description, effect, price, icon, buttonActive, onPress } = props;
    return (
        <ContentBox style={{ marginBottom: 18 }}>
            <View style={listItemStyles.container}>
                <View style={listItemStyles.left}>
                    <Emoji icon={icon} />
                </View>
                <View style={listItemStyles.center}>
                    <Text shadow={false} color={colors.purple.dark} size={20}>{name}</Text>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.yellow.dark} size={15}>{effect}</Text>
                </View>
                <View style={listItemStyles.right}>
                    {/* <Text style={{ lineHeight: 30 }} shadow={false} size={amountFontSize} color={colors.purple.medium}>{amount}</Text> */}
                    <Text style={{ textAlign: "center", lineHeight: 15 }} shadow={false} color={colors.purple.medium} size={14}>{formatNumber(price)} 💵</Text>
                </View>
            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
                marginHorizontal: 10,
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.purple.medium} size={15}>{description}</Text>
                </View>
                <View style={{
                    flexBasis: 90,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={90} variant={"blue"} label={"Buy"} />
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