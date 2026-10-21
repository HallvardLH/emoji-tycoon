import { ReactNode, Suspense, useEffect, useState } from "react";

// Never settles: a screen frozen with it stays paused until it's focused again
const never = new Promise<never>(() => { });

function Suspender({ freeze, children }: { freeze: boolean, children: ReactNode }) {
    if (freeze) throw never;
    return children;
}

interface Focusable {
    isFocused: () => boolean;
    addListener: (event: "focus" | "blur", callback: () => void) => () => void;
}

/**
 * Pauses a tab screen while it's not the one showing, so it stops re-rendering.
 *
 * Tabs stay mounted once visited, and hidden ones kept re-rendering with the game: the
 * Emojidex collection rebuilt ~1,600 cells on every tap and the stats 10 times a second,
 * which made tapping lag until a refresh unmounted them. The screen keeps its state and
 * catches up when it's shown again. Like react-freeze: a suspended subtree doesn't render.
 * (React Navigation's own freezeOnBlur needs react-native-screens, which the web doesn't use.)
 */
export default function FreezeWhenBlurred({ navigation, children }: { navigation: Focusable, children: ReactNode }) {
    const [focused, setFocused] = useState(() => navigation.isFocused());

    useEffect(() => {
        const offFocus = navigation.addListener("focus", () => setFocused(true));
        const offBlur = navigation.addListener("blur", () => setFocused(false));
        setFocused(navigation.isFocused());
        return () => { offFocus(); offBlur(); };
    }, [navigation]);

    return (
        <Suspense fallback={null}>
            <Suspender freeze={!focused}>{children}</Suspender>
        </Suspense>
    );
}
