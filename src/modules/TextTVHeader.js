import { IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";

export default props => {
  // const { handleMoreActionsClick, handleRefreshClick } = props;
  //typeof callback === "function"

  const { title = "TextTV.nu" } = props;

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>
          <Logo className="texttv-logo" />
          {title}
        </IonTitle>
        <IonButtons slot="end">
          <IonButtons slot="end">
            {/* <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
              <IonIcon size="small" slot="icon-only" name="share" />
            </IonButton>
            <IonButton fill="clear" slot="end" onClick={handleRefreshClick}>
              <IonIcon size="small" slot="icon-only" name="refresh" />
            </IonButton>
            <IonMenuButton menu="mainMenu" /> */}
          </IonButtons>
        </IonButtons>
      </IonToolbar>
      {props.children}
    </IonHeader>
  );
};
