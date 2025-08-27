import { StyleSheet, Animated } from "react-native";
import React from "react";

interface FlyingNumberProps {
    number: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
}

export const FlyingNumber = React.memo(({ number, xAnim, yAnim }: FlyingNumberProps) => (
    <Animated.Text
        style={[
            styles.number,
            {
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: yAnim.interpolate({
                    inputRange: [0, 50, 100],
                    outputRange: [1, 0.5, 0],
                }),
            },
        ]}
    >
        {number}
    </Animated.Text>
));

const styles = StyleSheet.create({
    number: {
        fontSize: 40,
        fontFamily: "Digitalt",
        color: '#FFD700', // Gold color for the number
        position: 'absolute',
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 0, height: 2.5 },
        textShadowRadius: 4
    },
});