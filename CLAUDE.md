# Emoji Tycoon

## Ads are switched off (AdMob approval pending)

Rewarded ads are turned off with `ADS_ENABLED = false` in `scripts/monetization.ts`, because AdMob hasn't approved the account yet. While it's off:

- The welcome back popup (`components/gameUI/OfflineModal.tsx`) hides the "📺 Watch an ad" button and offers only the gem claim and "No thanks".
- No rewarded ad is preloaded at start (`app/_layout.tsx`).
- Settings doesn't show the ad privacy option (`components/drawer/Settings.tsx`).

**When implementing or turning on ads, set `ADS_ENABLED` to `true`** so the welcome back popup's ad button comes back, then check all three places above work.
