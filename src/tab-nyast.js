import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import SenastUppdaterat from "./modules/SenastUppdaterat";

export const TabNyast = (props) => {
  console.log('tabnyast props', props);
  const {history} = props;
  
  // function onGotoPageChange(e) {
  //   console.log("onGotoPageChange", e.target.value);
  // }

  const doRefresh = e => {
    // console.log("do refresh", e);
    setTimeout(() => {
      // console.log("Async operation has ended");
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
        <SenastUppdaterat history={history} />
      </IonContent>
    </>
  );
};
