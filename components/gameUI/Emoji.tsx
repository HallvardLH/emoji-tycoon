import { Text } from "react-native";

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
        <Text style={{ fontSize: size }}>{icon}</Text>
    )
}