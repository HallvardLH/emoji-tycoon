export const colors = {
    // Base colors
    purple: {
        light: "#C16DFE",
        medium: "#A75CF4",
        dark: "#9F51FE",
        highlight: "#7054FE",
    },

    blue: {
        light: "#94E7FC",
        medium: "#4CDAFE",
        dark: "#09B9FF",
    },

    pink: {
        light: "#FDC0FF",
        medium: "#FC8AFF",
        dark: "#DA57F0",
        highlight: "#B20D78"
    },

    yellow: {
        light: "#FFDD17",
        medium: "#FFC715",
        dark: "#FFB213",
        highlight: "#FF8413",
    },

    green: {
        light: "#92F200",
        medium: "#86EE04",
        dark: "#67EB00",
        highlight: "#4EC307",
    },

    red: {
        medium: "#FF4672",
        dark: "#E90038",
    },

    metals: {
        gold: "#AE824E",
        silver: "#BCBABE",
        bronze: "#824F14",
    },

    border: "white",
}

// Colors named "highlight" for buttons denote the bottom section of an element, used to create a 3d effect
export const componentColors = {

    // For app backgorund gradient, starts with center color
    mainBg: {
        start: "#A559FE",
        end: "#7053FD",
    },

    button: { // The default color for all buttons if their color has not been specifically specified
        border: colors.border,
        text: "white",
    },

    submitButton: {
        bgLeft: colors.yellow.medium,
        bgRight: colors.yellow.dark,
        highlight: colors.yellow.highlight,
    },

    playButton: {
        bgLeft: colors.green.medium,
        bgRight: colors.green.dark,
        highlight: colors.green.highlight,
    },

    backButton: {
        background: colors.purple.medium,
        highlight: colors.purple.dark,
    },

    noButton: {
        background: colors.red.medium,
        highlight: colors.red.dark,
    },

    yesButton: {
        background: colors.green.light,
        highlight: colors.green.medium,
    },

    expandButton: {
        background: colors.purple.light,
        highlight: colors.purple.medium,
    },

    superlikeButton: {
        background: colors.blue.medium,
        highlight: colors.blue.dark,
    },

    toggleButton: {
        bgLeft: colors.purple.light,
        bgRight: colors.purple.medium,
        highlight: colors.purple.dark,
    },

    contentBox: {
        background: "white",
        highlight: colors.blue.medium,
        backgroundHighlight: "#D1D8FF",
        text: colors.purple.dark,
    },

    text: {
        default: "white",
        contentBox: colors.purple.dark,
        placeholder: "rgba(159, 81, 254, 0.5)",
        black: "black",
        dark: "#49454F",
    },

    contentTab: {
        border: colors.border,
        background: colors.purple.dark,
        focused: colors.purple.highlight,
    },

    tabBar: {
        border: colors.border,
        home: {
            background: colors.blue.medium,
            highlight: colors.blue.dark,
        },
        daily: {
            background: colors.pink.medium,
            highlight: colors.pink.dark,
        },
        browse: {
            background: colors.purple.light,
            highlight: colors.purple.medium,
        },
        profile: {
            background: colors.yellow.light,
            highlight: colors.yellow.dark,
        },
    }
}