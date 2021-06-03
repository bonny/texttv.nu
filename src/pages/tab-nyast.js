import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getUnixtime } from "../functions";
import { SenastUppdaterat } from "../modules/SenastUppdaterat";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import { BackButton } from "../modules/BackButton";

const queryString = require("query-string");

const TabNyast = (props) => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const { clicktime } = queryString.parse(history.location.search);

  // Uppdatera från server när clicktime ändrats,
  // dvs. när man klickat på fliken.
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
          <IonSegment
            value={selectedSegment}
            onClick={handleSegmentClick}
            swipeGesture={false}
          >
            <IonSegmentButton value="news">
              <IonLabel>Nyheter</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="sports">
              <IonLabel>Sport</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <BackButton history={history} />
          </IonButtons>
          <TextTVSearchBar history={history} />
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
