import {
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";
import React, { useState } from "react";
import MestLasta from "../modules/MestLasta";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("today");
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));

  const doRefresh = e => {
    setRefreshTime(Math.floor(Date.now() / 1000));
  };

  const handlePullToRefresh = e => {
    doRefresh();
    setTimeout(() => {
      e.target.complete();
    }, 500);
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
        title="Mest läst"
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
            <IonSegmentButton value="today">Idag</IonSegmentButton>
            <IonSegmentButton value="yesterday">Igår</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>

      <IonContent color="dark">
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        <MestLasta
          history={history}
          selectedSegment={selectedSegment}
          refreshTime={refreshTime}
        />
      </IonContent>
    </>
  );
};
