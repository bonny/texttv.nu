import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import SenastUppdaterat from "./modules/SenastUppdaterat";
import { ReactComponent as Logo } from "./images/logo.svg";

export const TabNyast = props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");

  const doRefresh = e => {
    setTimeout(() => {
      e.target.complete();
    }, 2000);
  };

  const handleSegmentChange = e => {
    setSelectedSegment(e.detail.value);
  };

  return (
    <>
      <TextTVHeader {...props}>
        <IonToolbar>
          <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
            <IonSegmentButton value="news">Nyheter</IonSegmentButton>
            <IonSegmentButton value="sports">Sport</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <SenastUppdaterat history={history} selectedSegment={selectedSegment} />
      </IonContent>
    </>
  );
};
