import { StyleSheet, View, Text as RNText } from "react-native";
import Text from "../generalUI/Text";
import Button from "../buttons/Button";
import ContentBox from "../generalUI/ContentBox";
import { colors } from "../misc/Colors";
import CircularButton from "../buttons/CircularButton";
import { useState } from "react";

type PluralNames = {
    [key: string]: string;
}
const pluralNames: PluralNames = {
    "Drawing hand": "Drawing hands",
    "Graphic design studio": "Graphic design studios",
    "Farm": "Farms",
    "Kitchen": "Kitchens",
    "Factory": "Factories",
    "Bank": "Banks",
    "Emoji assembly": "Emoji assemblies",
    "Flying saucer": "Flying saucers",
}

interface BuildingListItemProps {
    name: string;
    icon: string;
    description: string;
    price: number | string;
    baseEps: number | string;
    eps: number | string;
    amount: number;
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
        baseEps,
        eps,
        amount,
        amountFontSize = 30,
        buttonActive = true,
        onPress,
    } = props;

    const [showDetails, setShowDetails] = useState(false);

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
                </View>
                <View style={listItemStyles.right}>
                    <Text style={{ lineHeight: 30 }} shadow={false} size={amountFontSize} color={colors.purple.medium}>{amount}</Text>
                    <Text style={{ textAlign: "center", lineHeight: 15 }} shadow={false} color={colors.purple.medium} size={14}>{price} 💵</Text>
                </View>
            </View>
            <View style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center"
            }}>
                <Button disabled={!buttonActive} shadowHeight={8} onPress={onPress} height={34} width={110} variant={"blue"} label={"Buy"} />
                <Button shadowHeight={8} onPress={() => setShowDetails(!showDetails)} height={34} width={110} variant="submit" label={"Details"} />
            </View>
            {showDetails && (
                <View style={{
                    marginHorizontal: 10,
                }}>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        {'\u2022'} You have <Text shadow={false} color={colors.yellow.dark} size={15}>{amount}</Text> {amount == 1 ? name : pluralNames[name]}
                    </Text>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        {'\u2022'} Each produces <Text shadow={false} color={colors.yellow.dark} size={15}>{baseEps}</Text> emojis per second
                    </Text>
                    <Text shadow={false} color={colors.purple.dark} size={15}>
                        {'\u2022'} For a total of <Text shadow={false} color={colors.yellow.dark} size={15}>{eps}</Text> emojis per second!
                    </Text>
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