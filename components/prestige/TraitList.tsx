import { View, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../../scripts/redux/reduxStore";
import { traits, Trait, traitSlots, toggleTrait } from "../../scripts/game/prestige/traits";
import { getTraitName, getTraitUpside, getTraitDownside } from "../../i18n/content";
import i18n from "../../i18n";
import Text from "../generalUI/Text";
import { palette, radii, themedStyles } from "../misc/theme";
import { toCaps } from "../../scripts/utils";
import { styles as cardStyles } from "./PerkList";
import * as Haptics from "../../scripts/game/haptics";

const ordinal = (n: number) => i18n.t("prestige.ordinal", { count: n, ordinal: true });

/**
 * Traits for the run: picked while ascending, shown (and locked in) during a run
 */
export default function TraitList() {
    const { t } = useTranslation();
    const { ascending, prestiges, traits: picked = [] } = useSelector((state: RootState) => state.prestige);
    // Perks bought on the Perks tab can add slots
    useSelector((state: RootState) => state.prestige.perks.length);
    const slots = traitSlots();

    return (
        <View style={{ gap: 12 }}>
            <View style={{ gap: 4 }}>
                <View style={cardStyles.rowBetween}>
                    <Text size={20}>{t("traits.title")}</Text>
                    <Text font="bold" size={12} color={palette.lilac}>{t("traits.slots", { picked: picked.length, slots })}</Text>
                </View>
                <Text font="bold" size={13} color={palette.lilac} style={{ lineHeight: 18 }}>
                    {ascending ? t("traits.introAscending", { count: slots }) : t("traits.introRun")}
                </Text>
            </View>
            {traits.map(trait => (
                <TraitCard
                    key={trait.id}
                    trait={trait}
                    unlocked={prestiges >= trait.unlockAt}
                    picked={picked.includes(trait.id)}
                    editable={!!ascending}
                />
            ))}
        </View>
    );
}

function TraitCard({ trait, unlocked, picked, editable }: { trait: Trait, unlocked: boolean, picked: boolean, editable: boolean }) {
    const { t } = useTranslation();
    const canPress = editable && unlocked;
    const onPress = () => {
        toggleTrait(trait.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <Pressable
            disabled={!canPress}
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: picked, disabled: !canPress }}
            style={({ pressed }) => [
                cardStyles.perk,
                picked ? styles.picked : null,
                !unlocked ? cardStyles.perkLocked : null,
                pressed ? { opacity: 0.8 } : null,
            ]}
        >
            <View style={[cardStyles.perkIcon, picked ? { backgroundColor: palette.sun } : null]}>
                <Text size={24} style={{ lineHeight: 30, opacity: unlocked ? 1 : 0.4 }}>{unlocked ? trait.icon : "🔒"}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text size={16} color={unlocked ? palette.ink : "#FFFFFF"}>{unlocked ? getTraitName(trait) : "???"}</Text>
                {unlocked ? (
                    <>
                        <Text font="bold" size={13} color={palette.greenText} style={{ lineHeight: 18 }}>▲ {getTraitUpside(trait)}</Text>
                        <Text font="bold" size={13} color={palette.pop} style={{ lineHeight: 18 }}>▼ {getTraitDownside(trait)}</Text>
                    </>
                ) : (
                    <Text font="body" size={13} color={palette.lilac} style={{ lineHeight: 18 }}>
                        {t("traits.unlocksWith", { ordinal: ordinal(trait.unlockAt) })}
                    </Text>
                )}
            </View>
            {picked ? (
                <View style={styles.pickedTag}>
                    <Text font="black" size={12} color={palette.ink}>{toCaps(t("traits.pickedTag"))}</Text>
                </View>
            ) : null}
        </Pressable>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    picked: {
        borderWidth: 2,
        borderColor: palette.sun,
    },
    pickedTag: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: radii.sm,
        backgroundColor: palette.sun,
    },
}));
