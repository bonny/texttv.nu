import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";
import React, { useState } from "react";
import MestLasta from "./modules/MestLasta";
import { TextTVHeader } from "./modules/TextTVHeader";

export const TabPopulart = () => {
  const [selectedSegment, setSelectedSegment] = useState("today");

  const handleSegmentChange = e => {
    setSelectedSegment(e.detail.value);
  };

  return (
    <>
      <TextTVHeader>
        <IonToolbar>
          <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
            <IonSegmentButton value="today">Idag</IonSegmentButton>
            <IonSegmentButton value="yesterday">Igår</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>
      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>
        <MestLasta selectedSegment={selectedSegment} />
      </IonContent>
    </>
  );
};
