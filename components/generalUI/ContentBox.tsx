/**
 * Container for displaying text and various other informations to the user
 * 
 */
import { ReactNode, useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from "react-native";
import { componentColors } from "../misc/Colors";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import RibbonTitle from "../generalUI/RibbonTitle";

interface ContentBoxProps {
    children?: ReactNode;
    title?: string;
    text?: string | ReactNode;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
    headerColor?: string;
    isLoading?: boolean;
    /** 
    * @property Replaces the normal title with a big fancy title
    */
    ribbonTitle?: {
        topText: string;
        bottomText: string;
        stars?: boolean;
    }
    width?: DimensionValue;
}

export default function ContentBox(props: ContentBoxProps) {
    const {
        children,
        title,
        text,
        textColor = componentColors.contentBox.text,
        style,
        headerColor = componentColors.contentBox.highlight,
        isLoading = false,
        ribbonTitle,
        width = "88%",
    } = props;

    const [containerHeight, setContainerHeight] = useState(200); // Default minHeight

    // Whenever the layout changes, check the height of the contentBox,
    // This assures the shadow knows the height of the box, even when it become bigger than 200
    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
    };

    return (
        <View style={[styles.container, ribbonTitle ? { marginTop: 25 } : null]}>
            <Shadow height={containerHeight} shadowHeight={8} width={width} borderRadius={20} />
            <View style={[
                styles.background,
                { height: containerHeight + 4 },
                { width: width }
            ]} />
            <View style={[style, styles.contentBoxContainer, { width: width }]} onLayout={onLayout}>
                <>
                    {ribbonTitle && (
                        <View style={styles.ribbonTitleConatiner}>
                            <RibbonTitle stars={false} topText={ribbonTitle.topText} bottomText={ribbonTitle.bottomText ? ribbonTitle.bottomText : title} />
                        </View>
                    )}
                    {isLoading ? (
                        null // TODO: add loading indicator
                    ) : (
                        <>
                            {!ribbonTitle && title && (
                                <View style={[styles.titleContainer, { backgroundColor: headerColor }]}>
                                    <Text shadow={false}>{title ? title : null}</Text>
                                </View>
                            )}
                            {text && (
                                <View style={styles.textContainer}>
                                    <Text shadow={false} color={textColor} style={{ textAlign: "center" }}>{text}</Text>
                                </View>
                            )}
                            <View style={[ribbonTitle ? { marginTop: 40 } : null, { gap: 10 }]}>
                                {children}
                            </View>
                        </>
                    )}
                </>
            </View>
        </View>
    )
}

interface ContentBoxBottomProps {
    children?: ReactNode;
}

export function ContentBoxBottom({ children }: ContentBoxBottomProps) {
    return (
        <View style={styles.bottomContainer}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
    },

    contentBoxContainer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 20,
        backgroundColor: componentColors.contentBox.background,
        minHeight: 100,
        gap: 10
    },

    background: {
        position: "absolute",
        backgroundColor: componentColors.contentBox.backgroundHighlight,
        borderRadius: 20,
    },

    titleContainer: {
        borderRadius: 20,
        height: 26,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },

    textContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 60,
    },

    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },

    ribbonTitleConatiner: {
        position: "absolute",
        alignSelf: "center",
        top: -30,
    }
})