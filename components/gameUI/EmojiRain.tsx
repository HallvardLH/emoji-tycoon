import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Dimensions, Easing } from "react-native";
import { selectRandomEmoji } from "../../scripts/game/bigEmoji";
import Emoji from "./Emoji";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import { HEADER_HEIGHT, TAB_BAR_HEIGHT } from "../layout/ScreenView";

const { width, height } = Dimensions.get("window");

interface EmojiRainProps {
    delay?: number;
    bg?: string;
}

export default function EmojiRain({ delay = 0, bg }: EmojiRainProps) {
    const { emojisPerSecond } = useSelector((state: RootState) => state.values);
    const { effects } = useSelector((state: RootState) => state.effects);

    interface Raindrop {
        emoji: string;
        xPos: number;
        yPos: number;
        size: number;
        opacity: number;
        id: string;
    }

    const [section, setSection] = useState<Raindrop[]>([]);
    const rainAnim = useRef(new Animated.Value(-height + HEADER_HEIGHT)).current;

    // Use a ref to store the latest value of emojisPerSecond
    // This is required to access the newest value of emojisPerSecond
    const emojisPerSecondRef = useRef(emojisPerSecond);
    useEffect(() => {
        emojisPerSecondRef.current = emojisPerSecond;
    }, [emojisPerSecond]);

    const effectsRef = useRef(effects);
    useEffect(() => {
        effectsRef.current = effects;
    }, [effects]);

    const selectEmoji = () => {
        const activeEffects = effectsRef.current;
        // If there are any active effects...
        if (activeEffects.length > 0) {
            let emojiPool: string[] = [];
            // Add all active effect emojis to a pool
            activeEffects.forEach((effect) => {
                emojiPool.push(effect.emoji);
            })

            // Pick a random emoji from that pool
            return emojiPool[Math.floor(Math.random() * emojiPool.length)];

        }
        // If there is no active effect, return any random emoji
        return selectRandomEmoji().emoji;
    }

    const populateSection = () => {
        const newSection: Raindrop[] = [];
        // Use the ref value to ensure we're working with the latest value
        let emojiAmount = Math.floor(emojisPerSecondRef.current);
        const maxEmojiAmount = 75;

        // The minimum and maximum size an emoji can be on the screen
        const minEmojiSize = 25;
        const maxEmojiSize = 45;

        const minEmojiOpacity = 0.15;
        const maxEmojiOpacity = 0.75;

        // Cap the amount of emojis that can be added at once
        if (emojisPerSecondRef.current > maxEmojiAmount) {
            emojiAmount = maxEmojiAmount;
        }

        // Minimum distance between emojis
        const minDist = 50;
        // TODO: Make distance higher if emojiAmount is small
        const points: { x: number; y: number }[] = [];

        function isFarEnough(x: number, y: number): boolean {
            return points.every(p => Math.hypot(p.x - x, p.y - y) >= minDist);
        }

        let attempts = 0;
        while (newSection.length < emojiAmount && attempts < emojiAmount * 3) {
            const x = Math.floor(Math.random() * (width - 25));
            const y = Math.floor(Math.random() * (height - 50));

            if (isFarEnough(x, y)) {
                let size = Math.floor(Math.random() * (maxEmojiSize - minEmojiSize + 1)) + minEmojiSize;

                // Calculate opacity based on size
                // The minimum size gives the minimum possible opacity,
                // Max size gives the max opacity
                // Anything else fits somewhere in between
                let opacity = minEmojiOpacity + ((size - minEmojiSize) / (maxEmojiSize - minEmojiSize)) * (maxEmojiOpacity - minEmojiOpacity);

                let chosenEmoji = selectEmoji();

                points.push({ x, y });
                newSection.push({
                    emoji: chosenEmoji,
                    xPos: x,
                    yPos: y,
                    size: size,
                    opacity: opacity,
                    id: `${newSection.length}-${Date.now()}`,
                });
            }

            attempts++; // Prevent infinite loops
        }
        setSection(newSection);
    };

    useEffect(() => {
        const startAnimation = () => {
            // Generate new emojis at the start of each cycle
            populateSection();

            Animated.timing(rainAnim, {
                toValue: height - TAB_BAR_HEIGHT,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                // Reset animation position
                rainAnim.setValue(-height + HEADER_HEIGHT);
                // Restart animation when complete
                startAnimation();
            });
        };

        // Delay execution initially if a delay is specified
        const timeout = setTimeout(startAnimation, delay);

        // Cleanup on unmount
        return () => clearTimeout(timeout);
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.emojiSection,
                {
                    transform: [{ translateY: rainAnim }],
                    backgroundColor: bg
                }
            ]}>
                {section.map(item => (
                    <View
                        key={item.id}
                        style={{
                            position: 'absolute',
                            top: item.yPos,
                            left: item.xPos,
                            opacity: item.opacity,
                        }}>

                        <Emoji size={item.size} icon={item.emoji} />

                    </View>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        width,
        height,
        backgroundColor: "transparent",
    },
    emojiSection: {
        position: "absolute",
        width,
        height,
    },
});