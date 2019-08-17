import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenu,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { close } from "ionicons/icons";
import React from "react";
import { withRouter } from "react-router";
import MenuItems from "./MenuItems";

const Menu = props => {
  return (
    <IonMenu
      side="start"
      menuId="mainMenu"
      contentId="main"
      type="overlay"
      swipeGesture={false}
    >
      <IonHeader>
        <IonToolbar color="primary" mode="md">
          <IonTitle>Meny</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MenuItems {...props} />
      </IonContent>
    </IonMenu>
  );
};

const MenuWithRouter = withRouter(Menu);

export default Menu;
export { MenuWithRouter };
