import { spawnEffect } from '../../scripts/game/effects/onScreenEffects';
import Button from '../buttons/Button';
import ResetButton from './ResetButton';
import { View } from 'react-native';
import Text from '../generalUI/Text';

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
        </View>

    )
}