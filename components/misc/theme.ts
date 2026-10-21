/**
 * Design tokens for the "Candy Arcade" style.
 *
 * A dark grape stage lets the emojis be the only loud color,
 * paper cards hold information, and sun yellow means "you can spend this".
 */
export const palette = {
    // Stage
    grape: "#22154A",
    night: "#170E36",
    spotlight: "#4A33A6",

    // Cards
    paper: "#FBF8FF",
    tile: "#EFE8FF",
    track: "#E3DAF7",
    ink: "#1C1233",
    muted: "#5E5480",

    // Text on the stage
    lilac: "#B7A9EE",
    lilacLight: "#D9D0FA",

    // Accents
    violet: "#6A4BE0",
    violetDeep: "#4A33A6",
    sun: "#FFC53D",
    sunLedge: "#C98A00",
    pop: "#FF5C7A",
    mint: "#E3F7EC",
    green: "#1F9D63",
    greenText: "#1F7A4F",

    // Disabled controls
    disabled: "#E4DEF2",
    tileLedge: "#BFB2E6",

    // Translucent layers on the stage
    glass: "rgba(255,255,255,0.1)",
    glassSoft: "rgba(255,255,255,0.06)",
    glassLine: "rgba(255,255,255,0.18)",
    shade: "rgba(0,0,0,0.25)",
};

export const fonts = {
    display: "LilitaOne_400Regular",
    body: "Nunito_700Bold",
    bold: "Nunito_800ExtraBold",
    black: "Nunito_900Black",
    italic: "Nunito_700Bold_Italic",
};

export const radii = {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24,
    pill: 999,
};
