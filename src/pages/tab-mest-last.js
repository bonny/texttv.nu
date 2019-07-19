import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar
} from "@ionic/react";
import React, { useState, useContext, useEffect } from "react";
import {
  getAndSetIonPageContentAndIonPageScrollElement,
  getUnixtime
} from "../functions";
import MestLasta from "../modules/MestLasta";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";
import TabContext from "../TabContext";

export default props => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("today");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const [ionPageContent, setIonPageContent] = useState();
  const [ionPageScrollElement, setIonPageScrollElement] = useState();
  const tabsinfo = useContext(TabContext);
  const tabsinfoPopulart = tabsinfo.tabs.populart;

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

  const handleSegmentClick = e => {
    // console.log("handleSegmentClick", e);
  };

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

    if (ionPageScrollElement.scrollTop > 0) {
      // Scrolla upp och vi har scrollat ner.
      ionPageContent.scrollToTop(500);
    } else {
      // Ladda om om vi är längst uppe.
      doRefresh();
    }
  }, [ionPageScrollElement, ionPageContent, tabsinfoPopulart]);

  return (
    <>
      <TextTVHeader {...props} title="Mest läst">
        <IonToolbar color="primary">
          <IonSegment
            onIonChange={handleSegmentChange}
            onClick={handleSegmentClick}
            value={selectedSegment}
          >
            <IonSegmentButton value="today">Idag</IonSegmentButton>
            <IonSegmentButton value="yesterday">Igår</IonSegmentButton>
            <IonSegmentButton value="dayBeforeYesterday">
              I förrgår
            </IonSegmentButton>
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
