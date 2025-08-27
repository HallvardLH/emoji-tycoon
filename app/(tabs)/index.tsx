import ScreenView from "../../components/layout/ScreenView";
import React from 'react';
import BigEmoji from "../../components/gameUI/BigEmoji";
import EffectMeters from "../../components/gameUI/Meters/EffectMeters";
import EffectPopup from "../../components/gameUI/EffectPopup";
import PrestigeMeter from "../../components/gameUI/Meters/PrestigeMeter";
import { View } from "react-native";
import EmojiRain from "../../components/gameUI/EmojiRain";
import { TAB_BAR_HEIGHT, HEADER_HEIGHT } from "../../components/layout/ScreenView";
import { Dimensions } from "react-native";

export default function Home() {
    // This calculates the perfect delay in order for the
    // second emojiRain component to perfectly follow the first
    const getRainDelay = () => {
        const height = Dimensions.get("window").height
        // The total distance traveled by the first component is:
        const totalDistance = (height - TAB_BAR_HEIGHT) - (-height + HEADER_HEIGHT)
        // The first component fully enters the view when it has traveled a distance equal to the height of the screen. This distance is:
        const distanceToEnterView = height;
        // The total time for the component to complete one cycle is:
        const totalTime = 10000;
        // The time taken to travel this distance is proportional to the total distance and total time:
        const timeToEnterView = (distanceToEnterView / totalDistance) * totalTime

        return timeToEnterView;
    }
    return (
        <ScreenView>
            {/* <EmojiRain bg="#faba2f" delay={8250} />
            <EmojiRain bg="#c5075c" delay={2500} /> */}
            {/* <EmojiRain delay={getRainDelay() + 1000} />
            <EmojiRain delay={1000} /> */}
            <View style={{
                flexDirection: "row",
                position: "absolute",
                top: 0,
                width: "90%",
                justifyContent: "space-between",
            }}>
                <EffectMeters />

                <View>
                    <PrestigeMeter />
                </View>
            </View>
            <BigEmoji />
            <EffectPopup />
        </ScreenView>
    )
}