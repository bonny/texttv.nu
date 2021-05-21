import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getCurrentIonPageContentElm, getUnixtime } from "../functions";
import { MestLasta } from "../modules/MestLasta";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVRefresher from "../modules/TextTVRefresher";

const TabPopulart = (props) => {
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("today");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());

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

  const handleSegmentChange = (e) => {
    setSelectedSegment(e.detail.value);
  };

  /**
   * Scrolla upp när flik byts, annars börjar man nya fliken ev. nedscrollad
   * vilket är lite irri.
   */
  useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    ionPageContent && ionPageContent.scrollToTop();
  }, [selectedSegment]);

  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  /*   useEffect(() => {
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
  }, [tabsinfoPopulart]); */

  return (
    <IonPage>
      <TextTVHeader {...props} title="Mest läst">
        <IonToolbar color="primary">
          <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
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
