import type { Palette } from "../../../components/misc/theme";

/**
 * App themes: a reskin of the whole app, every colour in the palette. Bought with
 * gems, purely for looks. All keep a dark stage, light cards and a bright accent for
 * what can be spent, so every screen reads the same way in each.
 */
export interface AppTheme {
    id: string;
    name: string;
    icon: string;
    price: number;
    colours: Palette;
}

export const THEME_PRICE = 25;

// The see-through layers and fixed greens are shared by every theme
const shared = {
    mint: "#E3F7EC",
    green: "#1F9D63",
    greenText: "#1F7A4F",
    glass: "rgba(255,255,255,0.1)",
    glassSoft: "rgba(255,255,255,0.06)",
    glassLine: "rgba(255,255,255,0.18)",
    shade: "rgba(0,0,0,0.25)",
};

export const appThemes: AppTheme[] = [
    {
        id: "classic", name: "Classic", icon: "💜", price: 0,
        colours: {
            ...shared,
            grape: "#22154A", night: "#170E36", spotlight: "#4A33A6",
            paper: "#FBF8FF", tile: "#EFE8FF", track: "#E3DAF7", ink: "#1C1233", muted: "#5E5480",
            lilac: "#B7A9EE", lilacLight: "#D9D0FA",
            violet: "#6A4BE0", violetDeep: "#4A33A6", sun: "#FFC53D", sunLedge: "#C98A00", pop: "#FF5C7A",
            disabled: "#E4DEF2", tileLedge: "#BFB2E6",
        },
    },
    {
        id: "sunset", name: "Sunset", icon: "🌅", price: THEME_PRICE,
        colours: {
            ...shared,
            grape: "#3A1424", night: "#260B17", spotlight: "#B4472A",
            paper: "#FFF8F2", tile: "#FDE8DC", track: "#F6D6C4", ink: "#2A1210", muted: "#7A4E44",
            lilac: "#F5B49A", lilacLight: "#FCD9C8",
            violet: "#E2603A", violetDeep: "#A63A1E", sun: "#FFC53D", sunLedge: "#C98A00", pop: "#FF5C7A",
            disabled: "#F1E1D8", tileLedge: "#E5B9A3",
        },
    },
    {
        id: "ocean", name: "Ocean", icon: "🌊", price: THEME_PRICE,
        colours: {
            ...shared,
            grape: "#0B2540", night: "#06182C", spotlight: "#1C6E9C",
            paper: "#F4FBFF", tile: "#DDF0FA", track: "#C9E4F2", ink: "#0B1F33", muted: "#46637D",
            lilac: "#8FD3F5", lilacLight: "#C6EAFB",
            violet: "#1E88C7", violetDeep: "#145F8E", sun: "#FFD447", sunLedge: "#C99A00", pop: "#FF6B8B",
            disabled: "#DCE9F0", tileLedge: "#A9CCE0",
        },
    },
    {
        id: "forest", name: "Forest", icon: "🌲", price: THEME_PRICE,
        colours: {
            ...shared,
            grape: "#11291C", night: "#0A1C12", spotlight: "#2F7A4A",
            paper: "#F6FBF4", tile: "#E2F1DD", track: "#CFE6C8", ink: "#12261A", muted: "#4E6B55",
            lilac: "#A8DDB0", lilacLight: "#D2EFD5",
            violet: "#3E9A5B", violetDeep: "#2A6E40", sun: "#FFC53D", sunLedge: "#C98A00", pop: "#FF7A59",
            disabled: "#E0EBDD", tileLedge: "#B3D3AA",
        },
    },
    {
        id: "candy", name: "Candy", icon: "🍭", price: THEME_PRICE,
        colours: {
            ...shared,
            grape: "#3B1240", night: "#270A2B", spotlight: "#B23A8E",
            paper: "#FFF6FB", tile: "#FBE3F1", track: "#F4CFE5", ink: "#2B0F27", muted: "#7A4870",
            lilac: "#F7A8D8", lilacLight: "#FBD3EC",
            violet: "#D9469E", violetDeep: "#9E2C70", sun: "#FFE066", sunLedge: "#C9A400", pop: "#7B61FF",
            disabled: "#F3E0EB", tileLedge: "#E6B4D2",
        },
    },
    {
        id: "gold", name: "Gold", icon: "👑", price: THEME_PRICE * 2,
        colours: {
            ...shared,
            grape: "#16130E", night: "#0D0B07", spotlight: "#7A5A16",
            paper: "#FFFBF0", tile: "#F6EBCF", track: "#EADBB4", ink: "#1E180C", muted: "#6B5D3E",
            lilac: "#E3C98A", lilacLight: "#F1E2BB",
            violet: "#B8892B", violetDeep: "#8A641A", sun: "#FFD54A", sunLedge: "#B88F00", pop: "#FF5C7A",
            disabled: "#EFE6D2", tileLedge: "#D9C38E",
        },
    },
];

export const themeById = (id?: string) => appThemes.find(theme => theme.id === id) ?? appThemes[0];
