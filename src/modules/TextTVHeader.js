import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonBackButton
} from "@ionic/react";
import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";

export const TextTVHeader = props => {
  const { history, location, match } = props;

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
    </IonHeader>
  );
};
