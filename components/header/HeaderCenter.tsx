import { useState } from "react";
import { View, StyleSheet } from "react-native";
import Text from "../generalUI/Text";
import Shadow from "../misc/Shadow";
import { colors } from "../misc/Colors";
import EmojisAmount from "../gameUI/EmojisAmount";
import EpsAmount from "../gameUI/EpsAmount";

export default function HeaderCenter() {
    // For keeping the shadow the correct width even if the label changes the width of the container
    const [containerWidth, setContainerWidth] = useState(300);
    const onLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <View style={styles.container}>
            {/* <Shadow width={containerWidth} height={containerHeight} shadowHeight={4} borderRadius={containerBorderRadius} /> */}
            {/* <View style={styles.textContainer} onLayout={onLayout}> */}
            <Text><EmojisAmount fontSize={23} /> Emojis</Text>
            {/* </View> */}
            <EpsAmount fontSize={15} />
        </View>
    )
}

const containerHeight = 36;
const containerWidth = 150;
const containerBorderRadius = 50;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        minWidth: containerWidth,
        height: containerHeight,
    },

    textContainer: {
        borderRadius: containerBorderRadius,
        borderWidth: 2.5,
        borderColor: "white",
        minWidth: containerWidth,
        height: containerHeight,
        backgroundColor: colors.purple.dark,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    }
})