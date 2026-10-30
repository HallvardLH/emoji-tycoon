import { router } from "expo-router";
import { useCloseModalThen } from "../generalUI/Modal";

/** Opens the gem store. From inside a Modal, closes that first and opens once it's gone, see useAfterDismiss */
export function useOpenGemStore() {
    const closeModalThen = useCloseModalThen();
    return () => {
        const open = () => router.push("/gems");
        if (closeModalThen) closeModalThen(open);
        else open();
    };
}
