import {
  IonContent,
  IonHeader,
  IonMenu,
  IonToolbar,
  IonPage,
} from "@ionic/react";
import { withRouter } from "react-router";
import MenuItems from "./MenuItems";

const Menu = (props) => {
  return (
    <IonMenu
      side="start"
      menuId="mainMenu"
      contentId="routerOutletElm"
      type="overlay"
      swipeGesture={false}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
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
