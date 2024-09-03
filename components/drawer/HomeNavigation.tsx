import { useRef } from "react";
import CircularButton from "../buttons/CircularButton";
import Drawer from "./Drawer";
import DrawerLink from "./DrawerLink";
import ResetButton from "./ResetButton";
import Cheats from "./Cheats";

type DrawerRef = {
    openDrawer: () => void;
    closeDrawer: () => void;
};

export default function HomeNavigation() {
    const navigationDrawerRef = useRef<DrawerRef>(null);
    return (
        <>
            <CircularButton variant="hamburger" onPress={() => navigationDrawerRef.current?.openDrawer()} />
            <Drawer
                ref={navigationDrawerRef}
                containerStyle={[]}
                side="left"
            >
                <ResetButton onPress={() => navigationDrawerRef.current?.closeDrawer()} />
                <Cheats />
                <DrawerLink
                    text="Notifications"
                    linkTo="Notifications"
                    onPress={() => navigationDrawerRef.current?.closeDrawer()}
                />
                <DrawerLink
                    text="Results"
                    linkTo="Results"
                    onPress={() => navigationDrawerRef.current?.closeDrawer()}
                />
            </Drawer>
        </>
    )
}