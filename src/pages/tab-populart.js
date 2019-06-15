import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";
import React, { useState } from "react";
import MestLasta from "../modules/MestLasta";
import TextTVHeader from "../modules/TextTVHeader";

export default props => {
  const [selectedSegment, setSelectedSegment] = useState("today");

  const handleSegmentChange = e => {
    setSelectedSegment(e.detail.value);
  };

  return (
    <>
      <TextTVHeader title="Populärt">
        <IonToolbar color="primary">
          <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
            <IonSegmentButton value="today">Idag</IonSegmentButton>
            <IonSegmentButton value="yesterday">Igår</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>
        <MestLasta selectedSegment={selectedSegment} />
      </IonContent>
    </>
  );
};
