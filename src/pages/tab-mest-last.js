import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getUnixtime } from "../functions";
import { MestLasta } from "../modules/MestLasta";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";
const queryString = require("query-string");

const TabPopulart = (props) => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("today");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const { clicktime } = queryString.parse(history.location.search);

  // Uppdatera från server när clicktime ändrats,
  // dvs. när man klickat på fliken.
  useEffect(() => {
    doRefresh();
  }, [clicktime]);

  // Uppdatera dokument-titel.
  useEffect(() => {
    let pageTitle;

    switch (selectedSegment) {
      case "today":
      default:
        pageTitle = `Mest läst idag - de mest lästa Text-TV-sidorna idag`;
        break;
      case "yesterday":
        pageTitle = `Mest läst igår - de mest lästa Text-TV-sidorna igår`;
        break;
      case "dayBeforeYesterday":
        pageTitle = `Mest läst i förrgår - de mest lästa Text-TV-sidorna i förrgår`;
        break;
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
      <TextTVHeader {...props} title="Mest läst">
        <IonToolbar color="primary">
          <IonSegment
            value={selectedSegment}
            onClick={handleSegmentClick}
            swipeGesture={false}
          >
            <IonSegmentButton value="today">Idag</IonSegmentButton>
            <IonSegmentButton value="yesterday">Igår</IonSegmentButton>
            <IonSegmentButton value="dayBeforeYesterday">
              I förrgår
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </TextTVHeader>

      <IonContent>
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        <MestLasta
          history={history}
          selectedSegment={selectedSegment}
          refreshTime={refreshTime}
        />
      </IonContent>
    </IonPage>
  );
};

export { TabPopulart };
