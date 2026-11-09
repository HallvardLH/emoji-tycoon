import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, BackHandler } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../scripts/redux/reduxStore";
import { beginRun } from "../scripts/game/prestige/prestige";
import { essenceBonusPerEssence, essenceForBonus } from "../scripts/game/prestige/perks";
import { traits, traitSlots } from "../scripts/game/prestige/traits";
import { showInterstitialAd } from "../scripts/ads";
import { AUTOMATIC_ADS_ENABLED } from "../scripts/monetization";
import { formatNumber } from "../scripts/misc";
import i18n from "../i18n";
import Text from "../components/generalUI/Text";
import ChunkyButton from "../components/generalUI/ChunkyButton";
import CloseButton from "../components/generalUI/CloseButton";
import SegmentedControl from "../components/generalUI/SegmentedControl";
import PerkList from "../components/prestige/PerkList";
import TraitList from "../components/prestige/TraitList";
import AscensionReveal from "../components/prestige/AscensionReveal";
import { palette, radii, themedStyles } from "../components/misc/theme";
import { toCaps } from "../scripts/utils";

const percent = (value: number) => i18n.t("numbers.percent", { value: formatNumber(value) });
type Tab = "perks" | "traits";
// iOS can't show an ad while this screen is still closing
const BEGIN_RUN_AD_DELAY_MS = 1000;

/**
 * Ascension: perks and traits.
 *
 * Right after a prestige, it opens with the reveal and holds the game until the
 * player begins the next run (nothing runs while ascending, see gameLoop.ts).
 * During a run it's opened from the prestige screen to buy perks;
 * traits are only shown then, as a run keeps the ones it began with.
 */
export default function AscensionScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ essence?: string, gems?: string }>();
    const { ascending, emojiEssence, prestiges, history, traits: picked = [] } = useSelector((state: RootState) => state.prestige);
    useSelector((state: RootState) => state.prestige.perks.length);
    // The reveal plays once per prestige. Reopened later (the app closed mid-ascension), it shows the last run's essence
    const [revealing, setRevealing] = useState(!!ascending);
    const [tab, setTab] = useState<Tab>(ascending ? "traits" : "perks");
    const bonus = essenceBonusPerEssence();

    // Ascending, the only way out is to begin the next run
    useEffect(() => {
        if (!ascending) return;
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
        return () => subscription.remove();
    }, [ascending]);

    if (revealing) {
        return (
            <AscensionReveal
                essence={Number(params.essence ?? history?.[0]?.essence ?? 0)}
                gems={Number(params.gems ?? 0)}
                onContinue={() => setRevealing(false)}
            />
        );
    }

    // Back to the game; opened straight from a link there's nothing to go back to
    const leave = () => router.canGoBack() ? router.back() : router.replace("/");
    const onBegin = () => {
        beginRun();
        leave();
        // A natural break, once this screen has closed. Never after the first prestige
        if (AUTOMATIC_ADS_ENABLED && prestiges > 1) setTimeout(showInterstitialAd, BEGIN_RUN_AD_DELAY_MS);
    };

    const pickedTraits = traits.filter(trait => picked.includes(trait.id));
    const tabs: { id: Tab, label: string, badge?: number }[] = [
        { id: "perks", label: t("perks.title") },
        { id: "traits", label: t("traits.title"), badge: ascending ? Math.max(0, traitSlots() - picked.length) : undefined },
    ];

    return (
        <View style={styles.screen}>
            <SafeAreaView edges={["top"]} style={styles.topBar}>
                <View style={{ flex: 1 }}>
                    <Text size={30} style={{ lineHeight: 44 }}>{t("ascension.title")}</Text>
                    {ascending ? (
                        <Text font="bold" size={13} color={palette.lilac}>{t("ascension.subtitleAscending", { count: prestiges + 1 })}</Text>
                    ) : null}
                </View>
                {!ascending ? <CloseButton size={44} accessibilityLabel={t("prestige.close")} onPress={leave} /> : null}
            </SafeAreaView>

            <View style={styles.header}>
                <View style={styles.hero}>
                    <Text size={32} style={{ lineHeight: 40 }}>✨</Text>
                    <View style={{ flex: 1 }}>
                        <Text size={24} color={palette.ink} style={{ lineHeight: 28 }}>{formatNumber(emojiEssence)}</Text>
                        <Text font="bold" size={12} color={palette.greenText}>
                            {t("prestige.essenceBonus", { bonus: percent(Math.round(essenceForBonus() * bonus * 100)), each: percent(Math.round(bonus * 100)) })}
                        </Text>
                    </View>
                </View>
                <SegmentedControl
                    activeIndex={tabs.findIndex(item => item.id === tab)}
                    segments={tabs.map(item => ({ label: item.label, badge: item.badge, onPress: () => setTab(item.id) }))}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {tab === "perks" ? <PerkList /> : <TraitList />}
            </ScrollView>

            {ascending ? (
                <SafeAreaView edges={["bottom"]} style={styles.footer}>
                    <ChunkyButton
                        height={56}
                        labelSize={19}
                        label={t("ascension.beginRun", { count: prestiges + 1 })}
                        sublabel={toCaps(pickedTraits.length > 0
                            ? t("ascension.withTraits", { traits: pickedTraits.map(trait => trait.icon).join(" ") })
                            : t("ascension.noTraits"))}
                        onPress={onBegin}
                    />
                </SafeAreaView>
            ) : null}
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.grape,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        gap: 12,
    },
    hero: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 40,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: palette.night,
    },
}));
