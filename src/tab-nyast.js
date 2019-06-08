import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import SenastUppdaterat from "./modules/SenastUppdaterat";

export const TabNyast = props => {
  const { history } = props;

  const doRefresh = e => {
    setTimeout(() => {
      e.target.complete();
    }, 2000);
  };

  return (
    <>
      <TextTVHeader {...props} />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <SenastUppdaterat history={history} />
      </IonContent>
    </>
  );
};
