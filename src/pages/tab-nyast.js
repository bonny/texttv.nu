import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonLabel,
  useIonViewWillEnter,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { getUnixtime } from "../functions";
import { SenastUppdaterat } from "../modules/SenastUppdaterat";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";
const queryString = require("query-string");

const TabNyast = (props) => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());

  console.log("history.location", history.location);
  const { clicktime } = queryString.parse(history.location.search);

  useEffect(() => {
    doRefresh();
  }, [clicktime]);

  // Uppdatera dokument-titel beroende på valt segment.
  useEffect(() => {
    let pageTitle;

    switch (selectedSegment) {
      case "sports":
        pageTitle = "Nyaste sportsidorna";
        break;
      case "news":
        pageTitle = "Nyaste nyhetssidorna";
        break;
      default:
        pageTitle = "Nyaste sidorna";
    }

    document.title = pageTitle;
  }, [selectedSegment]);

  const doRefresh = (e) => {
    setRefreshTime(getUnixtime());
  };

  const handlePullToRefresh = (e) => {
    doRefresh();
    setTimeout(() => {
      e.target.complete();
    }, 500);
  };

  // Ändra flik eller ladda om vid klick på segment.
  const handleSegmentClick = (e) => {
    const clickedSegmentValue = e.target.value;
    if (clickedSegmentValue === selectedSegment) {
      // Om samma flik refresh.
      doRefresh();
    } else {
      // Ny flik, sätt segment bara.
      setSelectedSegment(clickedSegmentValue);
    }
  };

  return (
    <IonPage>
      <TextTVHeader {...props} title="Nyast">
        <IonToolbar color="primary">
          <IonSegment value={selectedSegment} onClick={handleSegmentClick}>
            <IonSegmentButton value="news">
              <IonLabel>Nyheter</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="sports">
              <IonLabel>Sport</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>

      <IonContent>
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        <SenastUppdaterat
          history={history}
          selectedSegment={selectedSegment}
          refreshTime={refreshTime}
        />
      </IonContent>
    </IonPage>
  );
};

export { TabNyast };
