import { StyleSheet, Animated, Platform } from 'react-native';
import React from "react";

interface FlyingEmojiProps {
    emoji: string;
    xAnim: Animated.Value;
    yAnim: Animated.Value;
}

export const FlyingEmoji = React.memo(({ emoji, xAnim, yAnim }: FlyingEmojiProps) => (
    <Animated.Text
        style={[
            styles.bigEmoji,
            {
                transform: [{ translateY: yAnim }, { translateX: xAnim }],
                opacity: yAnim.interpolate({
                    inputRange: [0, 30, 100],
                    outputRange: [1, 0.7, 0],
                }),
            },
        ]}
    >
        {emoji}
    </Animated.Text>
));

const styles = StyleSheet.create({
    bigEmoji: {
        fontSize: Platform.OS == "android" ? 150 : 200,
        position: 'absolute',
    },
});