import { useRef } from "react";
import CircularButton from "../buttons/CircularButton";
import Drawer from "../drawer/Drawer";
import DrawerLink from "../drawer/DrawerLink";
import ResetButton from "../gameUI/ResetButton";

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