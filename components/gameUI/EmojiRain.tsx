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

export default function EmojiRain({ delay, bg }: EmojiRainProps) {
    const { emojisPerSecond } = useSelector((state: RootState) => state.values);

    interface Raindrop {
        emoji: string;
        xPos: number;
        yPos: number;
        size: number;
        id: string;
    }

    const [section, setSection] = useState<Raindrop[]>([]);

    const populateSection = () => {
        const newSection: Raindrop[] = [];
        let emojiAmount = 50;

        if (emojisPerSecond < 1) {
            emojiAmount = 0;
        }

        const minDist = 50; // Minimum distance between emojis

        const points: { x: number; y: number }[] = [];

        function isFarEnough(x: number, y: number): boolean {
            return points.every(p => Math.hypot(p.x - x, p.y - y) >= minDist);
        }

        let attempts = 0;
        while (newSection.length < emojiAmount && attempts < emojiAmount * 3) {
            const x = Math.floor(Math.random() * width - 25);
            const y = Math.floor(Math.random() * (height - 50));

            if (isFarEnough(x, y)) {
                points.push({ x, y });
                newSection.push({
                    emoji: selectRandomEmoji().emoji,
                    xPos: x,
                    yPos: y,
                    size: Math.floor(Math.random() * (45 - 25 + 1)) + 25,
                    id: `${newSection.length}-${Date.now()}`,
                });
            }

            attempts++; // Prevent infinite loops
        }

        setSection(newSection);
    };



    // This calls the populate function each time the section
    // has completed one animation
    useEffect(() => {
        // Timeout to delay the interval from starting,
        // if the section has a delay specified
        setTimeout(() => {
            // Call the populate section immediately upon mount
            // unless a delay is specified
            populateSection();

            setInterval(() => {
                populateSection();
            }, 10000)
        }, delay)
    }, []);

    const rainAnim = useRef(new Animated.Value(-height + HEADER_HEIGHT)).current;

    useEffect(() => {
        const rainAnimation = Animated.loop(
            Animated.timing(rainAnim, {
                toValue: height - TAB_BAR_HEIGHT,
                duration: 10000,
                delay,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        rainAnimation.start(() => {
            populateSection();
            console.log("test")
        });

        return () => {
            rainAnimation.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.emojiSection, { transform: [{ translateY: rainAnim }], backgroundColor: bg, height, zIndex: delay }]}
            >
                {section.map(item => (
                    <View key={item.id} style={{ position: 'absolute', top: item.yPos, left: item.xPos, zIndex: delay }}>
                        <Emoji size={item.size} icon={item.emoji} />
                        {/* <View
                            style={{
                                backgroundColor: bg == "#c5075c" ? "blue" : "red",
                                width: 25,
                                height: 25,
                                borderRadius: 100,
                            }}
                        /> */}
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
