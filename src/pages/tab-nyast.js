import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import {
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm,
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
    setSelectedSegment(e.detail.value);
  };

  /**
   * Scrolla upp när flik byts, annars börjar man nya fliken ev. nedscrollad
   * vilket är lite irri.
   */
  useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    ionPageContent.scrollToTop();
  }, [selectedSegment]);

  // const handleSegmentClick = e => {
  //   console.log("handleSegmentClick", e);
  // };

  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  useEffect(() => {
    const scrollToTopOrRefresh = () => {
      const ionPageContent = getCurrentIonPageContentElm();
      const ionPageScrollElement = getCurrentIonPageScrollElm();

      if (!ionPageScrollElement) {
        return;
      }

      if (ionPageScrollElement.scrollTop > 0) {
        // Scrolla upp och vi har scrollat ner.
        ionPageContent.scrollToTop(500);
      } else {
        // Ladda om om vi är längst uppe.
        doRefresh();
      }
    };

    scrollToTopOrRefresh();
  }, [tabsinfoNyast]);

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

      <IonContent>
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
