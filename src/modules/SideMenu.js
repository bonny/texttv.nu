import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonPage
} from "@ionic/react";
import React from "react";
import { withRouter } from "react-router";
import MenuItems from "./MenuItems";

const Menu = props => {
  return (
    <IonMenu
      side="start"
      menuId="mainMenu"
      contentId="mainContent"
      type="overlay"
      swipeGesture={false}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary" mode="md">
            {/* <IonTitle>Meny</IonTitle> */}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <MenuItems {...props} />
        </IonContent>
      </IonPage>
    </IonMenu>
  );
};

const MenuWithRouter = withRouter(Menu);

export default Menu;
export { MenuWithRouter };
