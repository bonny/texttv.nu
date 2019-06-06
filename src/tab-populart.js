import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";
import MestLasta from "./modules/MestLasta";
import { TextTVHeader } from "./modules/TextTVHeader";

export const TabPopulart = () => {
  return (
    <>
      <TextTVHeader />
      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>
        <MestLasta />
      </IonContent>
    </>
  );
};
