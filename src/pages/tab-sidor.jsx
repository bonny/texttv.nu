import { IonContent, IonToolbar } from "@ionic/react";
import React, { useState, useContext, useEffect } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import TextTVSidorLista from "../modules/TextTVSidorLista";
import TabContext from "../TabContext";
import { getCurrentIonPageContent } from "../functions";

export default props => {
  const { history } = props;
  const tabsinfo = useContext(TabContext);
  const tabsinfoSidor = tabsinfo.tabs.sidor;
  const [ionPageContent, setIonPageContent] = useState();
  const [ionPageScrollElement, setIonPageScrollElement] = useState();

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Sidor - SVT Text TV`;
    console.log("tabsinfo på tab sidor", tabsinfoSidor);
  }, [tabsinfoSidor]);

  /**
   * Hämta och sätt ion page content och dess scroll element.
   * Behövs bara göras vid mount.
   */
  useEffect(() => {
    const currentIonPageContent = getCurrentIonPageContent();
    if (currentIonPageContent) {
      setIonPageContent(currentIonPageContent);
      currentIonPageContent.getScrollElement().then(elm => {
        setIonPageScrollElement(elm);
      });
    }
  }, []);

  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  useEffect(() => {
    if (!ionPageScrollElement) {
      return;
    }

    const scrollTop = ionPageScrollElement.scrollTop;
    // console.log(
    //   "startsida, useEffect to scroll to top",
    //   //tabsinfoHem,
    //   scrollTop,
    //   ionPageContent
    // );

    if (scrollTop > 0) {
      // Scrolla upp och vi har scrollat ner.
      ionPageContent.scrollToTop(500);
    } else {
      // Ladda om om vi är längst uppe.
      // setLatestUpdatedPagesRefreshTime(getUnixtime());
    }
  }, [ionPageScrollElement, ionPageContent, tabsinfoSidor]);

  return (
    <>
      <TextTVHeader title="Sidor">
        <IonToolbar color="dark">
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
