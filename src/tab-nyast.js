import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";
import { TextTVHeader } from "./modules/TextTVHeader";

export const TabNyast = () => {
  // function onGotoPageChange(e) {
  //   console.log("onGotoPageChange", e.target.value);
  // }

  const doRefresh = e => {
    console.log("do refresh", e);
    setTimeout(() => {
      console.log("Async operation has ended");
      e.target.complete();
    }, 2000);
  };

  return (
    <>
      <TextTVHeader />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

      </IonContent>
    </>
  );
};
