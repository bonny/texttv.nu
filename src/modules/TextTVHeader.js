import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, IonMenuButton } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";


export const TextTVHeader = () => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton menu='mainMenu'></IonMenuButton>
        </IonButtons>
        <IonTitle>
          <Logo className="texttv-logo" />
          TextTV.nu
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
