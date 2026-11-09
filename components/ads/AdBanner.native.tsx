import Constants, { ExecutionEnvironment } from "expo-constants";

/**
 * The banner on Android and iOS, except in Expo Go, where just importing
 * AdMob's library crashes the app (see scripts/ads.native.ts)
 */

const IN_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const AdMobBanner: typeof import("./AdMobBanner").default | undefined = IN_EXPO_GO ? undefined : require("./AdMobBanner").default;

export default function AdBanner() {
    return AdMobBanner ? <AdMobBanner /> : null;
}
