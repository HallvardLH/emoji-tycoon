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
                name={`×${BOOST_MULTIPLIER} Boost`}
                description={`×${BOOST_MULTIPLIER} production and taps for ${BOOST_SECONDS / 60} minutes. Buy again to add more time (up to ${BOOST_MAX_SECONDS / 3600} hours). Keeps going while you're away.`}
                status={boostLeft > 0 ? `⚡ ON · ${formatCountdown(boostLeft)} left` : undefined}
            >
                <GemButton
                    cost={BOOST_COST}
                    label={boostLeft > 0 ? "+30 min" : "Boost"}
                    onBuy={buyBoost}
                    disabled={!canBuyBoost()}
                    disabledLabel="FULL"
                    accessibilityLabel="Buy the boost"
                />
            </Power>

            {warpOn && (
                <Power
                    icon="⏩"
                    name="Time warp"
                    description="Get hours of production right now."
                >
                    {TIME_WARPS.map(warp => (
                        <View key={warp.hours} style={styles.warp}>
                            <Text font="bold" size={11} color={palette.muted}>+{formatNumber(timeWarpEmojis(warp.hours), 1)}</Text>
                            <GemButton
                                cost={warp.cost}
                                label={`${warp.hours} h`}
                                onBuy={() => buyTimeWarp(warp.hours)}
                                accessibilityLabel={`Warp ${warp.hours} hours`}
                            />
                        </View>
                    ))}
                </Power>
            )}

            {showerOn && (
                <Power
                    icon="🎆"
                    name="Effect shower"
                    description={`${SHOWER_EFFECTS} good effect emojis appear at once. Tap them before they fade!`}
                >
                    <GemButton cost={SHOWER_COST} label="Summon" onBuy={buyShower} accessibilityLabel="Summon an effect shower" />
                </Power>
            )}

            {comboOn && (
                <Power
                    icon="🧊"
                    name="Combo keeper"
                    description={`Your combo doesn't drop for ${COMBO_KEEPER_SECONDS / 60} minutes. Tap it up, then keep it.`}
                    status={keeperLeft > 0 ? `🧊 HOLDING · ${formatCountdown(keeperLeft)} left` : undefined}
                >
                    <GemButton
                        cost={COMBO_KEEPER_COST}
                        label="Keep"
                        onBuy={buyComboKeeper}
                        disabled={!canBuyComboKeeper()}
                        disabledLabel="FULL"
                        accessibilityLabel="Buy the combo keeper"
                    />
                </Power>
            )}

            {(discoveryOn || discoveries > 0) && (
                <Power
                    icon="🔍"
                    name="Discovery"
                    description={`The next ${DISCOVERY_EMOJIS} Big Emojis are ones you've never found.`}
                    status={discoveries > 0 ? `🔍 ${discoveries} new emoji${discoveries === 1 ? "" : "s"} to come` : undefined}
                >
                    <GemButton
                        cost={DISCOVERY_COST}
                        label="Discover"
                        onBuy={buyDiscovery}
                        disabled={!discoveryOn}
                        disabledLabel="ALL FOUND"
                        accessibilityLabel="Buy discoveries"
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
