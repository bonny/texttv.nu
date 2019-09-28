import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader
} from "@ionic/react";
import { document } from "ionicons/icons";
import React from "react";
import TextTVSidorLista from "./TextTVSidorLista";
import { navItems, navItemsAlsoLike } from "./navItems";

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
        <IonListHeader>Externa länkar om texttv.nu</IonListHeader>
        {navItems.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>

      <IonList>
        <IonListHeader>Vi på TextTV.nu gillar också</IonListHeader>
        {navItemsAlsoLike.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>
    </>
  );
};

export default MenuItems;
