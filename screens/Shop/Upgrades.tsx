import ScrollToTopView from "../../components/layout/ScrollToTopView";
import { View } from "react-native";

export default function Upgrades() {
    return (
        <View style={{ width: "100%" }}>
            <ScrollToTopView scrollToTopThreshold={Infinity}>
            </ScrollToTopView>
        </View>
    )
}