import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";

export const TextTVHeader = props => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="end">
          <IonMenuButton menu="mainMenu" />
        </IonButtons>
        <IonTitle>
          <Logo className="texttv-logo" />
          TextTV.nu
        </IonTitle>
      </IonToolbar>
      {props.children}
    </IonHeader>
  );
};
