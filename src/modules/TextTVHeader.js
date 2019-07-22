import { IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";

export default props => {
  const { title = "TextTV.nu", buttonsEnd } = props;

  return (
    <IonHeader>
      <IonToolbar color="primary" mode="md">
        <IonTitle>
          <Logo className="texttv-logo" />
          {title}
        </IonTitle>
        <IonButtons slot="end">
          <IonButtons slot="end">{buttonsEnd}</IonButtons>
        </IonButtons>
      </IonToolbar>
      {props.children}
    </IonHeader>
  );
};
