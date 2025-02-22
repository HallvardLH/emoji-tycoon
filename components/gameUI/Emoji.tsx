import { Text, Platform } from "react-native";

interface EmojiProps {
    icon: string;
    size?: number;
}

export default function Emoji(props: EmojiProps) {
    const {
        icon,
        size = 40
    } = props;

    return (
        <Text
            style={{
                // iOS emojis are a bit smaller, so increase their size by 15%
                fontSize: Platform.OS == "android" ? size : size * 1.15
            }}>
            {icon}
        </Text>
    )
}