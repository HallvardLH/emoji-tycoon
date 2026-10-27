import { ReactNode, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { spawnEffect, spawnEffects } from '../../scripts/game/effects/onScreenEffects';
import { giveOneOffEmojis } from '../../scripts/game/giveEmojis';
import { isAlwaysShiny, setAlwaysShiny } from '../../scripts/game/bigEmoji';
import ResetButton from './ResetButton';
import FunValueCheat from './FunValueCheat';
import SwitchRow from './SwitchRow';
import { cheatAddComboTaps, cheatMultiplyTapEarnings, cheatCollectEmojis, cheatAddMagicalEmojis, cheatAddEssence, cheatUnlockPerkTier, cheatAddRunTime, cheatReachTrialGoal } from '../../scripts/game/cheats';
import { registerAway } from '../../scripts/game/offline';
import { addGems } from '../../scripts/redux/gemsSlice';
import store from '../../scripts/redux/reduxStore';
import { DEBUG_SPEED, setGameSpeed, useGameSpeed } from '../../scripts/game/gameSpeed';
import Text from '../generalUI/Text';
import { palette, radii, themedStyles } from '../misc/theme';
import { formatDuration, formatNumber } from '../../scripts/misc';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '../../i18n';

interface CheatsProps {
    /** Closes the drawer */
    onPress: () => void;
}

export default function Cheats({ onPress }: CheatsProps) {
    const [onlyShiny, setOnlyShiny] = useState(isAlwaysShiny());
    const gameSpeed = useGameSpeed();
    const { t } = useTranslation();
    const plus = (amount: number) => `+${formatNumber(amount, 0, true)}`;

    return (
        <View style={styles.container}>
            <View style={styles.titleBlock}>
                <Text size={30}>{t("drawer.cheats")}</Text>
                <Text font="bold" size={13} color={palette.lilac}>{t("cheats.subtitle")}</Text>
            </View>

            <Section title={t("header.emojis")}>
                <View style={styles.row}>
                    <CheatButton label={plus(1e6)} onPress={() => giveOneOffEmojis(1e6)} compact />
                    <CheatButton label={plus(1e15)} onPress={() => giveOneOffEmojis(1e15)} compact />
                    <CheatButton label={plus(1e27)} onPress={() => giveOneOffEmojis(1e27)} compact />
                </View>
                <CheatButton icon="🌙" label={t("cheats.simulateAway")} onPress={() => { registerAway(3600); onPress(); }} />
            </Section>

            <Section title={t("cheats.gems")}>
                <View style={styles.row}>
                    <CheatButton label={t("cheats.addGems", { count: 10 })} onPress={() => store.dispatch(addGems(10))} compact />
                    <CheatButton label={t("cheats.addGems", { count: 100 })} onPress={() => store.dispatch(addGems(100))} compact />
                </View>
            </Section>

            <Section title={t("tabs.stats")}>
                <View style={styles.row}>
                    <CheatButton label={t("cheats.addComboTaps", { amount: formatNumber(10_000) })} onPress={() => cheatAddComboTaps(10_000)} compact />
                    <CheatButton label={t("cheats.multiplyTapEarnings", { factor: formatNumber(1000) })} onPress={() => cheatMultiplyTapEarnings(1000)} compact />
                </View>
                <View style={styles.row}>
                    <CheatButton label={t("cheats.addCollection", { count: 25 })} onPress={() => cheatCollectEmojis(25)} compact />
                    <CheatButton label={t("cheats.addShiny", { count: 5 })} onPress={() => cheatCollectEmojis(5, 1)} compact />
                    <CheatButton label={t("cheats.addMagical", { count: 10 })} onPress={() => cheatAddMagicalEmojis(10)} compact />
                </View>
            </Section>

            <Section title={t("prestige.title")}>
                <View style={styles.row}>
                    <CheatButton label={t("cheats.addEssence", { count: 100 })} onPress={() => cheatAddEssence(100)} compact />
                    <CheatButton label={t("cheats.addPerkTier", { count: 1 })} onPress={() => cheatUnlockPerkTier()} compact />
                </View>
                <View style={styles.row}>
                    <CheatButton label={t("cheats.addRunTime", { time: formatDuration(3600) })} onPress={() => cheatAddRunTime(3600)} compact />
                    <CheatButton label={t("cheats.reachTrialGoal")} onPress={() => cheatReachTrialGoal()} compact />
                </View>
            </Section>

            <Section title={t("cheats.effectEmojis")}>
                <CheatButton icon="✨" label={t("drawer.spawnEffect")} onPress={() => { spawnEffect(true); onPress(); }} />
                <CheatButton icon="🎆" label={t("cheats.spawnEffects", { count: 10 })} onPress={() => { spawnEffects(10); onPress(); }} />
            </Section>

            <Section title={t("cheats.speed")}>
                <SwitchRow
                    icon="⏩"
                    label={t("cheats.speedLabel", { speed: DEBUG_SPEED })}
                    hint={t("cheats.speedHint")}
                    value={gameSpeed > 1}
                    onChange={value => setGameSpeed(value ? DEBUG_SPEED : 1)}
                />
            </Section>

            <Section title={t("cheats.shiny")}>
                <SwitchRow
                    icon="🌟"
                    label={t("cheats.onlyShiny")}
                    value={onlyShiny}
                    onChange={value => { setAlwaysShiny(value); setOnlyShiny(value); }}
                />
            </Section>

            <Section title={t("stats.funValue")}>
                <FunValueCheat />
            </Section>

            <Section title={t("settings.dangerZone")}>
                <ResetButton onPress={onPress} />
            </Section>
        </View>
    )
}

function Section({ title, children }: { title: string, children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{title.toLocaleUpperCase(getLanguage())}</Text>
            {children}
        </View>
    );
}

interface CheatButtonProps {
    label: string;
    icon?: string;
    onPress: () => void;
    /** Sits in a row with others, label centred */
    compact?: boolean;
}

function CheatButton({ label, icon, onPress, compact }: CheatButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={({ pressed }) => [styles.button, compact ? styles.buttonCompact : null, pressed ? styles.pressed : null]}
        >
            {icon ? <Text size={18} style={styles.icon}>{icon}</Text> : null}
            <Text font={compact ? "black" : "bold"} size={14} style={compact ? styles.compactLabel : styles.buttonLabel}>{label}</Text>
        </Pressable>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    container: {
        alignSelf: "stretch",
        paddingHorizontal: 20,
        gap: 20,
    },
    titleBlock: {
        gap: 2,
    },
    section: {
        gap: 8,
    },
    sectionTitle: {
        letterSpacing: 1.3,
    },
    row: {
        flexDirection: "row",
        gap: 8,
    },
    button: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        borderRadius: radii.md,
        backgroundColor: palette.glass,
    },
    buttonCompact: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    pressed: {
        opacity: 0.7,
    },
    icon: {
        lineHeight: 24,
    },
    buttonLabel: {
        flex: 1,
    },
    compactLabel: {
        textAlign: "center",
    },
}));
