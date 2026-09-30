import { StyleSheet, Animated } from "react-native";
import React from "react";
import { fonts } from "../../misc/theme";

interface FlyingNumberProps {
    number: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
}

export const FlyingNumber = React.memo(({ number, xAnim, yAnim }: FlyingNumberProps) => (
    <Animated.Text
        pointerEvents="none"
        style={[
            styles.number,
            {
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: yAnim.interpolate({
                    inputRange: [-220, -110, 0],
                    outputRange: [0, 0.6, 1],
                }),
            },
        ]}
    >
        {number}
    </Animated.Text>
));

const styles = StyleSheet.create({
    number: {
        fontSize: 26,
        fontFamily: fonts.display,
        color: "#FFFFFF",
        position: 'absolute',
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    },
});
