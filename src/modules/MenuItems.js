import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader
} from "@ionic/react";
import { document } from "ionicons/icons";
import { navItems, navItemsAlsoLike } from "./navItems";
import TextTVSidorLista from "./TextTVSidorLista";

const MenuItem = ({ item }) => {
  const icon = item.icon ? item.icon : document;
  return (
    <IonItem href={item.href} rel="external" target="_blank">
      <IonIcon slot="start" icon={icon} />
      <IonLabel>{item.title}</IonLabel>
    </IonItem>
  );
};

const MenuItems = props => {
  return (
    <>
      <TextTVSidorLista {...props} showHeader={false} />

      <IonList>
        <IonListHeader>
          <IonLabel>Externa länkar om texttv.nu</IonLabel>
        </IonListHeader>
        {navItems.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Vi på TextTV.nu gillar också</IonLabel>
        </IonListHeader>
        {navItemsAlsoLike.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
        <IonItem routerLink="/debug" style={{ opacity: 0 }}>
          <IonIcon slot="start" icon={document} />
          <IonLabel>Debug</IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default MenuItems;
