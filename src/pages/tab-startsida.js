import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  useIonViewWillEnter
} from "@ionic/react";
import { star } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import {
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm,
  getFavorites,
  getUnixtime,
  saveFavorites
} from "../functions";
import RedigeraFavoriter from "../modules/RedigeraFavoriter";
import SenastUppdaterat from "../modules/SenastUppdaterat";
import { TabContext } from "../contexts/TabContext";
import PageTextTV from "./page-TextTV.js";

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

    if (tabsinfoHem.isNewTab) {
      // Vi kommer till denna flik från en annan flik.
      // Låt aktuellt innehåll + scrollpos vara.
    } else if (ionPageScrollElement.scrollTop > 0) {
      // Vi är redan på vår flik och har scrollat ner en bit,
      // så scrolla upp och vi har scrollat ner.
      ionPageContent.scrollToTop(500);
    } else {
      // Ladda om om vi är längst uppe.
      setLatestUpdatedPagesRefreshTime(getUnixtime());
    }
  }, [tabsinfoHem]);

  const handlePageTextTVRefresh = e => {
    setLatestUpdatedPagesRefreshTime(getUnixtime());
  };

  const [visaRedigeraFavoriter, setVisaRedigeraFavoriter] = useState(false);

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Hem - SVT Text TV`;
  }, [latestUpdatedPagesRefreshTime]);

  /**
   * Knapp som vid klick visar redigera favoriter-modalen.
   */
  const editFavoritesButton = (
    <IonItem
      button
      onClick={() => {
        setVisaRedigeraFavoriter(true);
      }}
    >
      <IonIcon slot="start" icon={star} />
      <IonLabel>Ändra favoriter...</IonLabel>
    </IonItem>
  );

  const [favoritePages, setFavoritePages] = useState([]);
    
  useIonViewWillEnter(() => {
    async function getFavs() {
      const favoritePages = await getFavorites();
      setFavoritePages(favoritePages);
    }

    getFavs();
  });

  return (
    <>
      <PageTextTV
        {...props}
        pageNum={favoritePages.join(",")}
        title="TextTV.nu"
        headerStyle="HEADER_STYLE_STARTPAGE"
        refreshTime={latestUpdatedPagesRefreshTime}
        onRefresh={handlePageTextTVRefresh}
        editFavoritesButton={editFavoritesButton}
      >
        <RedigeraFavoriter
          isOpen={visaRedigeraFavoriter}
          pages={favoritePages}
          handleSaveModal={pages => {
            setFavoritePages(pages);
            saveFavorites(pages);
            setVisaRedigeraFavoriter(false);
          }}
          handleCancelModal={() => {
            setVisaRedigeraFavoriter(false);
          }}
        />

        <IonGrid no-padding>
          <IonRow className="ion-justify-content-center">
            <IonCol className="u-max-width-texttvpage ion-no-padding">
              <h2 className="ion-padding-start ion-padding-end ion-text-left ion-no-margin">
                Senaste nyheterna
              </h2>
              <SenastUppdaterat
                {...props}
                refreshTime={latestUpdatedPagesRefreshTime}
                selectedSegment="news"
                count="5"
              />

              <h2 className="ion-padding-start xion-padding-top ion-padding-end ion-text-left ion-no-margin">
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
