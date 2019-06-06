import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";


export const TextTVHeader = () => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="primary">
          <IonButton>
            <IonIcon slot="icon-only" name="menu" />
          </IonButton>
        </IonButtons>
        <IonTitle>
          <Logo className="texttv-logo" />
          TextTV.nu
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
