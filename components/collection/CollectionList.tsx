import { View, FlatList } from "react-native";
import Text from "../generalUI/Text";
import { generateCollection } from "../../scripts/game/collection/emojiCategories";
import Emoji from "../gameUI/Emoji";

export default function CollectionList() {
    const collectedEmojis = generateCollection();

    return (
        <View>
            <FlatList
                data={collectedEmojis}
                numColumns={6}
                keyExtractor={(item, index) => `${item.category}-${index}`}
                renderItem={({ item }) => (
                    <View style={{
                        flexDirection: 'column',
                        margin: 10,
                        alignItems: "center"
                    }}>
                        <Emoji icon={item.emoji} />
                        <Text> x {item.amount}</Text>
                        {/* <Text> (Rarity: {item.rarity})</Text> */}
                    </View>
                )}
            />
        </View>
    )
}