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

const TabNyast = (props) => {
  const routeMatch = useRouteMatch({ path: props.match.path, exact: true });
  const { history } = props;
  const [selectedSegment, setSelectedSegment] = useState("news");
  const [refreshTime, setRefreshTime] = useState(getUnixtime());

  // @HERE: ladda om vid klick på flik
  useEffect(() => {
    if (!routeMatch) {
      return;
    }

    console.log(
      "routeMatch för tab nyast",
      selectedSegment,
      refreshTime,
      routeMatch
    );
    // doRefresh();
  }, [routeMatch, refreshTime, selectedSegment]);

  useIonViewWillEnter(() => {
    console.log("tab-nyast ionViewWillEnter");
  });

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

  const handleSegmentChange = (e) => {
    setSelectedSegment(e.detail.value);
  };

  /**
   * Scrolla upp när flik byts, annars börjar man nya fliken ev. nedscrollad
   * vilket är lite irri.
   */
  /*   useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    ionPageContent && ionPageContent.scrollToTop();
  }, [selectedSegment]);
 */
  // Scrolla till toppen om vi klickar på denna sidan tab igen
  // och vi är inte längst uppe redan
  // Dvs. klickad tab = hem men vi är inte scrollade längst upp.
  /* useEffect(() => {
    const scrollToTopOrRefresh = () => {
      const ionPageContent = getCurrentIonPageContentElm();
      const ionPageScrollElement = getCurrentIonPageScrollElm();

      if (!ionPageScrollElement || !ionPageContent) {
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
 */
  return (
    <IonPage>
      <TextTVHeader {...props} title="Nyast">
        <IonToolbar color="primary">
          <IonSegment
            // onIonChange={handleSegmentChange}
            value={selectedSegment}
            onClick={(e) => {
              const clickedSegmentValue = e.target.value;
              console.log('clickedSegmentValue', clickedSegmentValue)
              console.log('selectedSegment', selectedSegment)
              if (clickedSegmentValue === selectedSegment) {
                // Om samma flik refresh.
                console.log('samma flik');
                doRefresh();
              } else {
                // Ny flik, sätt segment bara.
                console.log('ny flik');
                setSelectedSegment(clickedSegmentValue);
              }
            }}
          >
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
