import { useState } from 'react';
import { spawnEffect, spawnEffects } from '../../scripts/game/effects/onScreenEffects';
import Button from '../buttons/Button';
import ResetButton from './ResetButton';
import { View } from 'react-native';
import Text from '../generalUI/Text';
import { giveOneOffEmojis } from '../../scripts/game/giveEmojis';
import { isAlwaysShiny, setAlwaysShiny } from '../../scripts/game/bigEmoji';
import FunValueCheat from './FunValueCheat';

interface CheatsProps {
    onPress: () => void;
}

export default function Cheats({ onPress }: CheatsProps) {
    const [onlyShiny, setOnlyShiny] = useState(isAlwaysShiny());

    return (
        <View style={{
            alignItems: "center",
            gap: 10,
        }}>
            <Text size={25}>Cheats</Text>
            <ResetButton onPress={onPress} />
            <Button width={200} label="Spawn effect emoji" onPress={() => {
                spawnEffect(true);
                onPress();
            }} />
            <Button width={200} label="Spawn 10 effect emojis" onPress={() => {
                spawnEffects(10);
                onPress();
            }} />
            <Button width={200} label={`Only shiny emojis: ${onlyShiny ? "ON" : "OFF"}`} onPress={() => {
                setAlwaysShiny(!onlyShiny);
                setOnlyShiny(!onlyShiny);
            }} />
            <Button width={200} label="Give 1 million emojis" onPress={() => {
                giveOneOffEmojis(1000000);
            }} />
            <Button width={200} label="Give 1 quadrillion emojis" onPress={() => {
                giveOneOffEmojis(1000000000000000);
            }} />
            <Button width={200} label="Give 1 octillion emojis" onPress={() => {
                giveOneOffEmojis(1000000000000000000000000000);
            }} />
            <FunValueCheat />
        </View>

    )
}
