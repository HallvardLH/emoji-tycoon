import { spawnEffect } from '../../scripts/game/effects/onScreenEffects';
import Button from '../buttons/Button';
import ResetButton from './ResetButton';
import { View } from 'react-native';
import Text from '../generalUI/Text';
import { giveOneOffEmojis } from '../../scripts/game/giveEmojis';
import { formatNumber } from '../../scripts/misc';
import { useTranslation } from 'react-i18next';

interface CheatsProps {
    onPress: () => void;
}

export default function Cheats({ onPress }: CheatsProps) {
    const { t } = useTranslation();
    return (
        <View style={{
            alignItems: "center",
            gap: 10,
        }}>
            <Text size={25}>{t("drawer.cheats")}</Text>
            <ResetButton onPress={onPress} />
            <Button width={200} label={t("drawer.spawnEffect")} onPress={() => {
                spawnEffect(true);
                onPress();
            }} />
            <Button width={200} label={t("drawer.giveEmojis", { amount: formatNumber(1000000) })} onPress={() => {
                giveOneOffEmojis(1000000);
            }} />
            <Button width={200} label={t("drawer.giveEmojis", { amount: formatNumber(1000000000000000) })} onPress={() => {
                giveOneOffEmojis(1000000000000000);
            }} />
            <Button width={200} label={t("drawer.giveEmojis", { amount: formatNumber(1000000000000000000000000000) })} onPress={() => {
                giveOneOffEmojis(1000000000000000000000000000);
            }} />
        </View>

    )
}