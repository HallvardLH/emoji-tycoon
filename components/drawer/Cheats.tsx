import { spawnEffect } from '../../scripts/game/effects/onScreenEffects';
import Button from '../buttons/Button';

export default function Cheats() {
    return (
        <Button width={200} label="Spawn effect emoji" onPress={() => {
            spawnEffect(true);
        }} />
    )
}