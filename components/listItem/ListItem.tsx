import { ReactNode } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import { componentColors } from "../misc/Colors";
import ContentBox from "../generalUI/ContentBox";

interface RightComponentProps {
    text: string;
    displayArrow: boolean;
}

function RightComponent(props: RightComponentProps) {
    const { text, displayArrow } = props;
    return (
        <View style={rightStyles.container}>
            {displayArrow && (
                <Image style={rightStyles.icon} source={require("../../assets/icons/arrow-right.png")} />
            )}
            <Text shadow={false} color={"black"}>{text}</Text>
        </View>
    )
}

const rightStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        gap: 10,
        alignItems: "center",
        flex: 1,
    },

    icon: {
        width: 20,
        height: 20,
    }
})


interface CenterComponentProps {
    title?: string;
    text?: string;
    bottomText?: string;
    titleColor?: string;
    textColor?: string;
    stats?: {
        likes?: number;
        participants?: number;
    }
}

function CenterComponent(props: CenterComponentProps) {
    const { title, text, bottomText, titleColor = componentColors.text.black, textColor = componentColors.text.dark, stats } = props;
    return (
        <View style={centerStyles.centerContainer}>
            <Text shadow={false} numberOfLines={1} color={titleColor}>{title}</Text>
            {text && (
                <Text shadow={false} numberOfLines={2} size={15} style={{ letterSpacing: 0.5 }} color={textColor}>{text}</Text>
            )}
            {bottomText && (
                <Text color="rgba(73, 69, 79, 0.5)" size={15} shadow={false}>{bottomText}</Text>
            )}
            {stats && (
                <View style={centerStyles.statsContainer}>
                    {stats.likes && (
                        <View style={centerStyles.stat}>
                            <Image style={centerStyles.icon} source={require("../../assets/icons/likes.png")} />
                            <Text shadow={false} color="#49454F" size={16}>{stats.likes}</Text>
                        </View>
                    )}
                    {stats.participants && (
                        <View style={centerStyles.stat}>
                            <Image style={centerStyles.icon} source={require("../../assets/icons/participants.png")} />
                            <Text shadow={false} color="#49454F" size={16}>{stats.participants}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

const centerStyles = StyleSheet.create({
    centerContainer: {
        gap: 2,
        justifyContent: "space-evenly",
        flex: 1
    },

    statsContainer: {
        flexDirection: "row",
        gap: 10,
    },

    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    icon: {
        height: 14,
        width: 14,
    }
})


interface ListItemProps {
    left?: ReactNode;
    center?: ReactNode;
    useDefaultCenter?: boolean;
    centerTitle?: string;
    centerText?: string | null;
    centerBottomText?: string;
    centerTitleColor?: string;
    centerTextColor?: string;
    stats?: {
        likes?: number;
        participants?: number;
    }
    right?: ReactNode;
    useDefaultRight?: boolean;
    rightText?: string | null;
    rightArrow?: boolean;
    noBox?: boolean;
    onPress?: () => void;
}

export default function ListItem(props: ListItemProps) {
    const {
        left,
        center,
        useDefaultCenter,
        centerTitle,
        centerText,
        centerBottomText,
        centerTitleColor,
        centerTextColor,
        stats,
        right,
        useDefaultRight,
        rightText = "",
        rightArrow = true,
        noBox,
        onPress
    } = props;

    const ParentTag = noBox ? View : ContentBox;
    return (
        <ParentTag style={{ marginBottom: 18 }}>
            <TouchableOpacity onPress={onPress} style={listItemStyles.container}>
                <View style={listItemStyles.left}>
                    {left}
                </View>
                <View style={listItemStyles.center}>
                    {useDefaultCenter ? (
                        <CenterComponent title={centerTitle} text={centerText ? centerText : ""} bottomText={centerBottomText} textColor={centerTextColor} titleColor={centerTitleColor} stats={stats} />
                    ) : (
                        <>
                            {center}
                        </>
                    )}
                </View>
                <View style={listItemStyles.right}>
                    {useDefaultRight ? (
                        <RightComponent displayArrow={rightArrow} text={rightText ? rightText : ""} />
                    ) : (
                        <>
                            {right}
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </ParentTag>
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
    },

    center: {
        flex: 1,
    },

    right: {
        flexBasis: 26,
    },
})