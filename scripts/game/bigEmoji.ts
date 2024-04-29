import { store } from '../redux/reduxStore';
import { updateEmojis } from '../redux/valuesSlice';
import { updateEmojisPerTap } from '../redux/bigEmojiSlice';
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
}

export function calculateEpt() {
    // Base emojis per tap
    const baseEmojisPerTap = store.getState().bigEmoji.baseEmojisPerTap;
    // Adds emojis to base per tap
    const emojisPerTapAdd = store.getState().bigEmoji.eptAdd;
    // Multiplies emojis per tap
    const emojisPerTapMultiplier = store.getState().bigEmoji.eptMult;

    let ept = (baseEmojisPerTap + emojisPerTapAdd) * emojisPerTapMultiplier

    console.log(baseEmojisPerTap, emojisPerTapAdd, emojisPerTapMultiplier, ept)

    store.dispatch(updateEmojisPerTap(ept));
}

calculateEpt()

type effectTypes = "none" | "doubleGain"

export function getEffect(effect: effectTypes) {

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

export function pickNextEmoji() {
    // Generate cumulative weights
    let cumulativeWeights: number[] = [];
    let total = 0;
    const emojiTypes = Object.keys(emojiWeights); // Extract keys to an array
    emojiTypes.forEach(type => {
        total += emojiWeights[type];
        cumulativeWeights.push(total);
    });

    // Random selection based on cumulative weights
    let randomNum = Math.random() * total;
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (randomNum < cumulativeWeights[i]) {
            const type = emojiTypes[i];
            const emojis = emojiData[type as keyof typeof emojiData];
            const randomEmojiIndex = Math.floor(Math.random() * emojis.length);
            return emojis[randomEmojiIndex]; // Return a random emoji from the selected type
        }
    }
}
