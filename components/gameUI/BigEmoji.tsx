import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, Animated, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../scripts/redux/reduxStore';
import { tapEmoji, pickNextEmoji } from '../../scripts/game/bigEmoji';
import { percentageOf } from '../../scripts/utils';
import PulseAnimation from '../animations/PulseAnimation';

export default function BigEmoji() {
    const { bigEmoji } = useSelector((state: RootState) => state.values);

    // State for the currently displayed static emoji
    const [staticEmoji, setStaticEmoji] = useState(bigEmoji);

    // State to keep track of multiple animating emojis
    const [animatingEmojis, setAnimatingEmojis] = useState([]);

    // Function to handle emoji tap
    const onEmojiTap = () => {
        // Get the current emoji
        const animatingEmoji = staticEmoji;

        // Select a random emoji to animate
        const nextEmoji = pickNextEmoji();

        setStaticEmoji(nextEmoji as string);

        // Create new animated values for the animating emoji
        const newYAnimValue = new Animated.Value(0); // For vertical movement
        const newXAnimValue = new Animated.Value(0); // For horizontal movement

        // Random horizontal target value between -200 and 200
        const randomXToValue = Math.floor(Math.random() * 401) - 200;

        // Generate a unique key for the animating emoji using the current timestamp
        const uniqueKey = `${nextEmoji}-${Date.now()}`;

        // Add the animating emoji to the state with both animated values
        const newAnimatingEmoji = {
            key: uniqueKey,
            emoji: animatingEmoji,
            yAnimValue: newYAnimValue,
            xAnimValue: newXAnimValue,
        };
        setAnimatingEmojis(current => [...current, newAnimatingEmoji]);


        // Start simultaneous animations for vertical and horizontal movements
        Animated.parallel([
            // Vertical bounce and fall
            Animated.sequence([
                Animated.timing(newYAnimValue, {
                    toValue: -30,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(newYAnimValue, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            // Horizontal random movement
            Animated.sequence([
                Animated.timing(newXAnimValue, {
                    toValue: percentageOf(33, randomXToValue),
                    duration: 100, // Match the duration of the initial bounce for synchronized effect
                    useNativeDriver: true,
                }),
                Animated.timing(newXAnimValue, {
                    toValue: percentageOf(66, randomXToValue),
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // Update the static emoji and remove the completed animation
            setAnimatingEmojis(current => current.filter(item => item.key !== uniqueKey));
        });

        tapEmoji();
    };

    return (
        <Pressable onPress={onEmojiTap} style={styles.container}>
            <View style={styles.container}>
                {/* Static Emoji */}
                <PulseAnimation maxSize={1.06} duration={5000}>
                    <Text style={styles.bigEmoji}>{staticEmoji}</Text>
                </PulseAnimation>
                {/* Animating Emojis */}
                {animatingEmojis.map(({ key, emoji, yAnimValue, xAnimValue }) => (
                    <Animated.Text
                        key={key}
                        style={[
                            styles.bigEmoji,
                            {
                                transform: [
                                    { translateY: yAnimValue },
                                    { translateX: xAnimValue },
                                ],
                                // Getting error: Property 'interpolate' does not exist on type 'never'.ts(2339)
                                opacity: yAnimValue.interpolate({
                                    inputRange: [0, 30, 100],
                                    outputRange: [1, 0.7, 0],
                                }),
                            },
                        ]}
                    >
                        {emoji}
                    </Animated.Text>
                ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // maxHeight: 100,
        height: 100,
        // width: 100,
    },
    bigEmoji: {
        fontSize: 150,
        position: 'absolute', // Position absolutely to allow overlapping
    },
});
