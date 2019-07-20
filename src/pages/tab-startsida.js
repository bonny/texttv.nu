import React, { useState, useEffect, useContext } from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import PageTextTV from "./page-TextTV.js";
import SenastUppdaterat from "../modules/SenastUppdaterat";
import TabContext from "../TabContext";
import {
  getUnixtime,
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm
} from "../functions";

const Startsida = props => {
  const tabsinfo = useContext(TabContext);
  const tabsinfoHem = tabsinfo.tabs.hem;
  const [
    latestUpdatedPagesRefreshTime,
    setLatestUpdatedPagesRefreshTime
  ] = useState(getUnixtime());

  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  useEffect(() => {
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
      setLatestUpdatedPagesRefreshTime(getUnixtime());
    }
  }, [tabsinfoHem]);

  const handlePageTextTVRefresh = e => {
    // console.log("handlePageTextTVRefresh", e);
    setLatestUpdatedPagesRefreshTime(getUnixtime());
  };

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Hem - SVT Text TV`;
  }, [latestUpdatedPagesRefreshTime]);

  return (
    <>
      <PageTextTV
        {...props}
        pageNum="100,300,700"
        title="TextTV.nu"
        headerStyle="HEADER_STYLE_STARTPAGE"
        refreshTime={latestUpdatedPagesRefreshTime}
        onRefresh={handlePageTextTVRefresh}
      >
        <IonGrid no-padding>
          <IonRow className="ion-justify-content-center">
            <IonCol className="u-max-width-texttvpage">
              <h2 className="ion-padding-start ion-padding-end ion-text-left">
                Senaste nyheterna
              </h2>
              <SenastUppdaterat
                {...props}
                refreshTime={latestUpdatedPagesRefreshTime}
                selectedSegment="news"
                count="5"
              />

              <h2 className="ion-padding-start ion-padding-top ion-padding-end ion-text-left">
                Senaste sportnyheterna
              </h2>
              <SenastUppdaterat
                {...props}
                refreshTime={latestUpdatedPagesRefreshTime}
                selectedSegment="sports"
                count="5"
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </PageTextTV>
    </>
  );
};

export default Startsida;
