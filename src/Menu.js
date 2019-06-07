import {
  IonMenu,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonIcon,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonMenuToggle,
  IonButton
} from "@ionic/react";
import React from "react";

export default () => {
  return (
    <IonMenu side="end" menuId="mainMenu" contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle menu="mainMenu">
              <IonButton>
                <IonIcon slot="icon-only" name="close" />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>Sidor</IonListHeader>
          <IonItem button>
            <IonIcon slot="start" name="person" />
            <IonLabel>Ditten</IonLabel>
          </IonItem>
          <IonItem button>
            <IonIcon slot="start" name="help" />
            <IonLabel>Datten</IonLabel>
          </IonItem>
          <IonItem button>
            <IonIcon slot="start" name="map" />
            <IonLabel>Gör något</IonLabel>
          </IonItem>
          <IonItem button>
            <IonIcon slot="start" name="information-circle" />
            <IonLabel>Besök vår sajt vettja</IonLabel>
          </IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
        </IonList>

        <IonList>
          <IonListHeader>Annat kul</IonListHeader>
          <IonItem>Best of SVT Text</IonItem>
          <IonItem>TextTV.nu på Twitter</IonItem>
          <IonItem>SVT Nyheter</IonItem>
        </IonList>

        <IonList>
          <IonListHeader>Om TextTV.nu</IonListHeader>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
          <IonItem>Menu Item</IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
