import { store } from '../../redux/reduxStore';
import { CollectionState, CollectionEmoji } from '../../redux/collectionSlice';
import faces from '../../../assets/emojis/faces.json';
import symbols from '../../../assets/emojis/symbols.json';
import people from '../../../assets/emojis/people.json';
import animals from '../../../assets/emojis/animals.json';
import food from '../../../assets/emojis/food.json';
import bodyParts from '../../../assets/emojis/bodyParts.json';
import objects from '../../../assets/emojis/objects.json';
import placesBuildings from '../../../assets/emojis/placesBuildings.json';
import plants from '../../../assets/emojis/plants.json';
import vehicles from '../../../assets/emojis/vehicles.json';
import weather from '../../../assets/emojis/weather.json';

export const emojiCategories: Record<string, string[]> = {
    faces,
    symbols,
    people,
    animals,
    food,
    bodyParts,
    objects,
    placesBuildings,
    plants,
    vehicles,
    weather,
};

export function generateCollection(): CollectionEmoji[] {
    const collectionState: CollectionState = store.getState().collection;

    // Array to store the results
    let collectedEmojisList: CollectionEmoji[] = [];

    // Iterate through each category in emojiCategories
    for (const category in emojiCategories) {
        if (emojiCategories.hasOwnProperty(category)) {
            const emojisInCategory = emojiCategories[category];
            const collectionDataInCategory = collectionState[category as keyof CollectionState];

            // Iterate through each emoji in the current category
            emojisInCategory.forEach((emoji, index) => {
                const collectionData = collectionDataInCategory?.[index];

                // Only include the emoji if it has been collected (amount > 0)
                if (collectionData && collectionData.amount > 0) {
                    collectedEmojisList.push({
                        category: category,
                        emoji: emoji,
                        amount: collectionData.amount,
                        rarity: collectionData.rarity,
                    });
                }
            });
        }
    }

    return collectedEmojisList;
}