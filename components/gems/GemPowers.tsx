import { ReactNode, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../scripts/redux/reduxStore";
import Text from "../generalUI/Text";
import GemButton from "./GemButton";
import { formatNumber } from "../../scripts/misc";
import {
    BOOST_COST, BOOST_SECONDS, BOOST_MAX_SECONDS, buyBoost, canBuyBoost,
    TIME_WARPS, buyTimeWarp, canBuyTimeWarp, timeWarpEmojis,
    SHOWER_COST, SHOWER_EFFECTS, buyShower, canBuyShower,
    COMBO_KEEPER_COST, COMBO_KEEPER_SECONDS, buyComboKeeper, canBuyComboKeeper,
    DISCOVERY_COST, DISCOVERY_EMOJIS, buyDiscovery, canBuyDiscovery,
} from "../../scripts/game/gems/gemShop";
import { boostSecondsLeft, comboKeeperSecondsLeft, formatCountdown, BOOST_MULTIPLIER } from "../../scripts/game/gems/boost";
import { hasCombo } from "../../scripts/game/tapBoost";
import { palette, radii, themedStyles } from "../misc/theme";
import { useTranslation } from "react-i18next";
import { toCaps } from "../../scripts/utils";

/** Re-renders once a second, for the countdowns and what can be bought */
function useTicker() {
    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, []);
}

/**
 * Everything gems do in a run: the boost, time warps, effect showers, the combo
 * keeper and discoveries. Ones for features the player hasn't found yet stay hidden
 */
export default function GemPowers() {
    useTicker();
    const { t } = useTranslation();
    const full = toCaps(t("gemPowers.fullCaps"));
    // Re-render when gems or what they bought change, not only on the tick
    useSelector((state: RootState) => state.gems);
    const comboOn = useSelector(() => hasCombo());
    const discoveries = useSelector((state: RootState) => state.gems.discoveries ?? 0);

    const boostLeft = boostSecondsLeft();
    const keeperLeft = comboKeeperSecondsLeft();
    const showerOn = canBuyShower();
    const warpOn = canBuyTimeWarp();
    const discoveryOn = canBuyDiscovery();

    return (
        <View style={styles.list}>
            <Power
                icon="⚡"
                name={t("gemPowers.boost.name", { multiplier: BOOST_MULTIPLIER })}
                description={t("gemPowers.boost.description", { multiplier: BOOST_MULTIPLIER, minutes: BOOST_SECONDS / 60, hours: BOOST_MAX_SECONDS / 3600 })}
                status={boostLeft > 0 ? `⚡ ${toCaps(t("gemPowers.boost.statusCaps", { time: formatCountdown(boostLeft) }))}` : undefined}
            >
                <GemButton
                    cost={BOOST_COST}
                    label={boostLeft > 0 ? t("gemPowers.boost.extend", { minutes: BOOST_SECONDS / 60 }) : t("gemPowers.boost.buy")}
                    onBuy={buyBoost}
                    disabled={!canBuyBoost()}
                    disabledLabel={full}
                    accessibilityLabel={t("gemPowers.boost.a11y")}
                />
            </Power>

            {warpOn && (
                <Power
                    icon="⏩"
                    name={t("gemPowers.timeWarp.name")}
                    description={t("gemPowers.timeWarp.description")}
                >
                    {TIME_WARPS.map(warp => (
                        <View key={warp.hours} style={styles.warp}>
                            <Text font="bold" size={11} color={palette.muted}>+{formatNumber(timeWarpEmojis(warp.hours), 1)}</Text>
                            <GemButton
                                cost={warp.cost}
                                label={t("gemPowers.timeWarp.hours", { hours: warp.hours })}
                                onBuy={() => buyTimeWarp(warp.hours)}
                                accessibilityLabel={t("gemPowers.timeWarp.a11y", { hours: warp.hours })}
                            />
                        </View>
                    ))}
                </Power>
            )}

            {showerOn && (
                <Power
                    icon="🎆"
                    name={t("gemPowers.shower.name")}
                    description={t("gemPowers.shower.description", { amount: SHOWER_EFFECTS })}
                >
                    <GemButton cost={SHOWER_COST} label={t("gemPowers.shower.buy")} onBuy={buyShower} accessibilityLabel={t("gemPowers.shower.a11y")} />
                </Power>
            )}

            {comboOn && (
                <Power
                    icon="🧊"
                    name={t("gemPowers.comboKeeper.name")}
                    description={t("gemPowers.comboKeeper.description", { minutes: COMBO_KEEPER_SECONDS / 60 })}
                    status={keeperLeft > 0 ? `🧊 ${toCaps(t("gemPowers.comboKeeper.statusCaps", { time: formatCountdown(keeperLeft) }))}` : undefined}
                >
                    <GemButton
                        cost={COMBO_KEEPER_COST}
                        label={t("gemPowers.comboKeeper.buy")}
                        onBuy={buyComboKeeper}
                        disabled={!canBuyComboKeeper()}
                        disabledLabel={full}
                        accessibilityLabel={t("gemPowers.comboKeeper.a11y")}
                    />
                </Power>
            )}

            {(discoveryOn || discoveries > 0) && (
                <Power
                    icon="🔍"
                    name={t("gemPowers.discovery.name")}
                    description={t("gemPowers.discovery.description", { amount: DISCOVERY_EMOJIS })}
                    status={discoveries > 0 ? `🔍 ${t("gemPowers.discovery.status", { amount: discoveries })}` : undefined}
                >
                    <GemButton
                        cost={DISCOVERY_COST}
                        label={t("gemPowers.discovery.buy")}
                        onBuy={buyDiscovery}
                        disabled={!discoveryOn}
                        disabledLabel={toCaps(t("gemPowers.discovery.allFoundCaps"))}
                        accessibilityLabel={t("gemPowers.discovery.a11y")}
                    />
                </Power>
            )}
        </View>
    );
}

function Power({ icon, name, description, status, children }: { icon: string, name: string, description: string, status?: string, children: ReactNode }) {
    return (
        <View style={styles.power}>
            <View style={styles.head}>
                <View style={styles.tile}>
                    <Text size={26} style={{ lineHeight: 32 }}>{icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                    <Text size={17} color={palette.ink}>{name}</Text>
                    <Text font="body" size={13} color={palette.muted} style={{ lineHeight: 18 }}>{description}</Text>
                </View>
            </View>
            {status ? <Text font="black" size={12} color={palette.greenText}>{status}</Text> : null}
            <View style={styles.actions}>{children}</View>
        </View>
    );
}

const styles = themedStyles(() => StyleSheet.create({
    list: {
        gap: 10,
        alignSelf: "stretch",
    },
    power: {
        gap: 8,
        padding: 12,
        borderRadius: radii.lg,
        backgroundColor: palette.paper,
    },
    head: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
    },
    tile: {
        width: 46,
        height: 46,
        borderRadius: radii.md,
        backgroundColor: palette.tile,
        alignItems: "center",
        justifyContent: "center",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: 8,
    },
    warp: {
        alignItems: "center",
        gap: 2,
    },
}));
