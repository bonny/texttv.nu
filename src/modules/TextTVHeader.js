import { IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";

export default props => {
  const { title = "TextTV.nu", buttonsEnd, children } = props;

  return (
    <IonHeader className="texttv-hide-smallest-screens">
      <IonToolbar color="primary">
        <IonTitle>
          <Logo className="texttv-logo" />
          {title}
        </IonTitle>
        <IonButtons slot="end">
          <IonButtons slot="end">{buttonsEnd}</IonButtons>
        </IonButtons>
      </IonToolbar>
      {children}
    </IonHeader>
  );
};
