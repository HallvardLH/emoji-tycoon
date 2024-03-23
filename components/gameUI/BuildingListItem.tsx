import { StyleSheet, View, Text as RNText } from "react-native";
import Text from "../generalUI/Text";
import Button from "../buttons/Button";
import ContentBox from "../generalUI/ContentBox";
import { colors } from "../misc/Colors";
import CircularButton from "../buttons/CircularButton";

interface BuildingListItemProps {
    name: string;
    icon: string;
    description: string;
    price: number | string;
    eps: number | string;
    amount: number | string;
    amountFontSize?: number;
    buttonActive?: boolean;
    onPress: () => void;
}

export default function BuildingListItem(props: BuildingListItemProps) {
    const {
        name,
        icon,
        description,
        price,
        eps,
        amount,
        amountFontSize = 30,
        buttonActive = true,
        onPress,
    } = props;

    return (
        <ContentBox style={{ marginBottom: 18 }}>
            <View style={listItemStyles.container}>
                <View style={listItemStyles.left}>
                    <RNText style={{ fontSize: 40 }}>{icon}</RNText>
                    {/* <CircularButton variant="minimize" /> */}
                </View>
                <View style={listItemStyles.center}>
                    <Text shadow={false} color={colors.purple.dark} size={20}>{name}</Text>
                    <Text style={{ letterSpacing: 0.1 }} shadow={false} color={colors.purple.medium} size={15}>{description}</Text>
                    <View style={{
                        flexDirection: "row",
                        gap: 10,
                    }}>
                        <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={110} variant={"blue"} label={"Buy"} />
                        <Button shadowHeight={8} onPress={() => null} height={34} width={110} variant="submit" label={"Details"} />
                    </View>
                </View>
                <View style={listItemStyles.right}>
                    <Text style={{ lineHeight: 30 }} shadow={false} size={amountFontSize} color={colors.purple.medium}>{amount}</Text>
                    <Text style={{ textAlign: "center", lineHeight: 15 }} shadow={false} color={colors.purple.medium} size={14}>{price} 💵</Text>
                </View>
            </View>
        </ContentBox>
    )
}

const listItemStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 8,
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