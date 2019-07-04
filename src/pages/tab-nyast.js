import {
  IonContent,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";
import { refresh } from "ionicons/icons";

import React, { useState } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import SenastUppdaterat from "../modules/SenastUppdaterat";
import TextTVRefresher from "../modules/TextTVRefresher";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
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

  // let pageTitle;
  // switch (selectedSegment) {
  //   case "sports":
  //     pageTitle = "Nyaste sportsidorna";
  //     break;
  //   case "news":
  //     pageTitle = "Nyaste nyhetssidorna";
  //     break;
  //   default:
  //     pageTitle = "Nyaste sidorna";
  // }

  return (
    <>
      <TextTVHeader
        {...props}
        title="Nyast"
        buttonsEnd={
          <IonButtons slot="end">
            <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
              <IonIcon slot="icon-only" icon={refresh} mode="md" />
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
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        <SenastUppdaterat
          history={history}
          selectedSegment={selectedSegment}
          refreshTime={refreshTime}
        />
      </IonContent>
    </>
  );
};
