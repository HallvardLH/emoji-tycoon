import { spawnEffect } from '../../scripts/game/effects/onScreenEffects';
import Button from '../buttons/Button';
import ResetButton from './ResetButton';
import { View } from 'react-native';
import Text from '../generalUI/Text';
import { giveOneOffEmojis } from '../../scripts/game/giveEmojis';

interface CheatsProps {
    onPress: () => void;
}

export default function Cheats({ onPress }: CheatsProps) {
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
            <Button width={200} label="Give 1 million emojis" onPress={() => {
                giveOneOffEmojis(1000000);
            }} />
        </View>

    )
}