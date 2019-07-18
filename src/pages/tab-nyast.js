import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from "@ionic/react";
import React, { useState } from "react";
import { getUnixtime } from "../functions";
import SenastUppdaterat from "../modules/SenastUppdaterat";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());

  const doRefresh = e => {
    setRefreshTime(getUnixtime());
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

  // const handleRefreshBtnClick = e => {
  //   doRefresh();
  // };

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
        // buttonsEnd={
        //   <IonButtons slot="end">
        //     <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
        //       <IonIcon slot="icon-only" icon={refresh} mode="md" />
        //     </IonButton>
        //   </IonButtons>
        // }
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
