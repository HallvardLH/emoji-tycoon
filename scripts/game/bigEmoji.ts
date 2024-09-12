import { store } from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { updateBigEmoji, updateNextEmoji } from '../redux/bigEmojiSlice';
import { addToCollection, CollectionState } from '../redux/collectionSlice';
import faces from '../../assets/emojis/faces.json';
import symbols from '../../assets/emojis/symbols.json';
import people from '../../assets/emojis/people.json';
import animals from '../../assets/emojis/animals.json';
import food from '../../assets/emojis/food.json';
import bodyParts from '../../assets/emojis/bodyParts.json';
import objects from '../../assets/emojis/objects.json';
import placesBuildings from '../../assets/emojis/placesBuildings.json';
import plants from '../../assets/emojis/plants.json';
import vehicles from '../../assets/emojis/vehicles.json';
import weather from '../../assets/emojis/weather.json';

export function tapEmoji() {
    store.dispatch(updateEmojis(
        store.getState().values.emojis + store.getState().bigEmoji.emojisPerTap
    ));

    const currentEmoji = store.getState().bigEmoji.bigEmoji;
    store.dispatch(addToCollection({
        category: currentEmoji.category as keyof CollectionState,
        id: currentEmoji.id,
    }));

    const nextEmoji = store.getState().bigEmoji.nextEmoji;
    store.dispatch(updateBigEmoji({
        emoji: nextEmoji.emoji,
        category: nextEmoji.category,
        id: nextEmoji.id,
    }));
}

interface EmojiWeights {
    [key: string]: number;
}

const emojiWeights: EmojiWeights = {
    faces: 30,
    symbols: 3,
    people: 8,
    animals: 20,
    food: 20,
    bodyParts: 10,
    objects: 15,
    placesBuildings: 10,
    plants: 10,
    vehicles: 10,
    weather: 10
};

const emojiData = {
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
    weather
};

/**
 * Randomly selects the next big emoji, with weighted probabilities for each emoji type
 *
 * The function calculates the total weight based on the weights assigned to different emoji categories. 
 * It then generates a random number and selects an emoji category based on the weighted probabilities. 
 * After selecting a category, it picks a random emoji from that category and dispatches it to the store.
 * This is the next emoji!
 *
 */
export function pickNextEmoji() {
    const emojiCategories = Object.keys(emojiWeights);

    // Calculate the total weight
    const totalWeight = emojiCategories.reduce((total, category) => total + emojiWeights[category], 0);

    // Generate a random number up to the total weight
    let randomNum = Math.random() * totalWeight;

    // Find the emoji type corresponding to the random number
    for (const category of emojiCategories) {
        // Check if the random number falls within the current category's weight
        if (randomNum < emojiWeights[category]) {
            const emojis = emojiData[category as keyof typeof emojiData];
            // Randomly select an emoji from the chosen category
            const randomEmojiIndex = Math.floor(Math.random() * emojis.length);
            store.dispatch(updateNextEmoji({
                emoji: emojis[randomEmojiIndex],
                category: category,
                id: randomEmojiIndex,
            }))
            return emojis[randomEmojiIndex] as string;
        }
        randomNum -= emojiWeights[category];  // Decrease randomNum by the current weight
    }
}
