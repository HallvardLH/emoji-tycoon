import { ReactNode, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { spawnEffect, spawnEffects } from '../../scripts/game/effects/onScreenEffects';
import { giveOneOffEmojis } from '../../scripts/game/giveEmojis';
import { isAlwaysShiny, setAlwaysShiny } from '../../scripts/game/bigEmoji';
import ResetButton from './ResetButton';
import FunValueCheat from './FunValueCheat';
import SwitchRow from './SwitchRow';
import { cheatAddComboTaps, cheatMultiplyTapEarnings, cheatCollectEmojis, cheatAddMagicalEmojis, cheatAddEssence, cheatUnlockPerkTier } from '../../scripts/game/cheats';
import Text from '../generalUI/Text';
import { palette, radii } from '../misc/theme';

interface CheatsProps {
    /** Closes the drawer */
    onPress: () => void;
}

export default function Cheats({ onPress }: CheatsProps) {
    const [onlyShiny, setOnlyShiny] = useState(isAlwaysShiny());

    return (
        <View style={styles.container}>
            <View style={styles.titleBlock}>
                <Text size={30}>Cheats</Text>
                <Text font="bold" size={13} color={palette.lilac}>For testing. Changes apply to your save.</Text>
            </View>

            <Section title="EMOJIS">
                <View style={styles.row}>
                    <CheatButton label="+1 M" onPress={() => giveOneOffEmojis(1e6)} compact />
                    <CheatButton label="+1 Qa" onPress={() => giveOneOffEmojis(1e15)} compact />
                    <CheatButton label="+1 Oc" onPress={() => giveOneOffEmojis(1e27)} compact />
                </View>
            </Section>

            <Section title="STATS">
                <View style={styles.row}>
                    <CheatButton label="+10k combo taps" onPress={() => cheatAddComboTaps(10_000)} compact />
                    <CheatButton label="×1000 tap earnings" onPress={() => cheatMultiplyTapEarnings(1000)} compact />
                </View>
                <View style={styles.row}>
                    <CheatButton label="+25 collection" onPress={() => cheatCollectEmojis(25)} compact />
                    <CheatButton label="+5 shiny" onPress={() => cheatCollectEmojis(5, 1)} compact />
                    <CheatButton label="+10 magical" onPress={() => cheatAddMagicalEmojis(10)} compact />
                </View>
            </Section>

            <Section title="PRESTIGE">
                <View style={styles.row}>
                    <CheatButton label="+100 essence" onPress={() => cheatAddEssence(100)} compact />
                    <CheatButton label="+1 perk tier" onPress={() => cheatUnlockPerkTier()} compact />
                </View>
            </Section>

            <Section title="EFFECT EMOJIS">
                <CheatButton icon="✨" label="Spawn an effect emoji" onPress={() => { spawnEffect(true); onPress(); }} />
                <CheatButton icon="🎆" label="Spawn 10 effect emojis" onPress={() => { spawnEffects(10); onPress(); }} />
            </Section>

            <Section title="SHINY">
                <SwitchRow
                    icon="🌟"
                    label="Only shiny emojis"
                    value={onlyShiny}
                    onChange={value => { setAlwaysShiny(value); setOnlyShiny(value); }}
                />
            </Section>

            <Section title="FUN VALUE">
                <FunValueCheat />
            </Section>

            <Section title="DANGER ZONE">
                <ResetButton onPress={onPress} />
            </Section>
        </View>
    )
}

function Section({ title, children }: { title: string, children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text font="black" size={11} color={palette.lilac} style={styles.sectionTitle}>{title}</Text>
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

const styles = StyleSheet.create({
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
});
