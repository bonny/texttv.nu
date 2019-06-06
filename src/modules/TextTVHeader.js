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
  console.log("TextTVHeader history", history, history.goBack);

  const goBack = () => {
    console.log('go back', history, location, match);   
  }

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton menu="mainMenu" />
          <IonBackButton
            goBack={goBack}
            // defaultHref={`/${match.params.tab}`}
            defaultHref='/hem'
          />
        </IonButtons>
        <IonTitle>
          <Logo className="texttv-logo" />
          TextTV.nu
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
