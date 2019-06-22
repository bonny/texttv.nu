import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";
import React, { useState } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import SenastUppdaterat from "../modules/SenastUppdaterat";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));

  const doRefresh = e => {
    setRefreshTime(Math.floor(Date.now() / 1000));
  };

  const handleIonRefresh = e => {
    doRefresh();
    setTimeout(() => {
      e.target.complete();
    }, 1000);
  };

  const handleSegmentChange = e => {
    console.log("handleSegmentChange", e);
    setSelectedSegment(e.detail.value);
  };

  const handleSegmentClick = e => {
    console.log("handleSegmentClick", e);
  };

  const handleRefreshBtnClick = e => {
    doRefresh();
  };

  return (
    <>
      <TextTVHeader
        {...props}
        title="Nyast"
        buttonsEnd={
          <IonButtons slot="end">
            <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
              <IonIcon slot="icon-only" name="refresh" mode="md" />
            </IonButton>
          </IonButtons>
        }
      >
        <IonToolbar color="primary">
          <IonSegment
            onIonChange={handleSegmentChange}
            onClick={handleSegmentClick}
            value={selectedSegment}
          >
            <IonSegmentButton value="news">Nyheter</IonSegmentButton>
            <IonSegmentButton value="sports">Sport</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>

      <IonContent color="dark">
        <IonRefresher slot="fixed" onIonRefresh={handleIonRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <SenastUppdaterat
          history={history}
          selectedSegment={selectedSegment}
          refreshTime={refreshTime}
        />
      </IonContent>
    </>
  );
};
