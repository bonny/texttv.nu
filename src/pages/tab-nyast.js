import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import {
  getAndSetIonPageContentAndIonPageScrollElement,
  getUnixtime
} from "../functions";
import SenastUppdaterat from "../modules/SenastUppdaterat";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";
import TabContext from "../TabContext";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const [ionPageContent, setIonPageContent] = useState();
  const [ionPageScrollElement, setIonPageScrollElement] = useState();
  const tabsinfo = useContext(TabContext);
  const tabsinfoNyast = tabsinfo.tabs.nyast;

  // Uppdatera dokument-titel.
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
  }, [selectedSegment, tabsinfoNyast]);

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
    // console.log("handleSegmentChange", e);
    setSelectedSegment(e.detail.value);
  };

  // const handleSegmentClick = e => {
  //   console.log("handleSegmentClick", e);
  // };

  /**
   * Hämta och sätt ion page content och dess scroll element.
   * Behövs bara göras vid mount.
   */
  useEffect(() => {
    getAndSetIonPageContentAndIonPageScrollElement(
      setIonPageContent,
      setIonPageScrollElement
    );
  }, []);

  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  useEffect(() => {
    if (!ionPageScrollElement) {
      return;
    }

    console.log(ionPageScrollElement, ionPageScrollElement.scrollTop);

    if (ionPageScrollElement.scrollTop > 0) {
      // Scrolla upp och vi har scrollat ner.
      ionPageContent.scrollToTop(500);
    } else {
      // Ladda om om vi är längst uppe.
      doRefresh();
    }
  }, [ionPageScrollElement, ionPageContent, tabsinfoNyast]);

  return (
    <>
      <TextTVHeader {...props} title="Nyast">
        <IonToolbar color="primary">
          <IonSegment
            onIonChange={handleSegmentChange}
            // onClick={handleSegmentClick}
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
