import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import { starOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { getUnixtime, saveFavorites } from "../functions";
import { RedigeraFavoriter } from "../modules/RedigeraFavoriter";
import { SenastUppdaterat } from "../modules/SenastUppdaterat";
import PageTextTV from "./page-TextTV.js";

const Startsida = (props) => {
  const routeMatch = useRouteMatch({ path: "/hem", exact: true });
  const userFavorites = useContext(FavoritesContext);
  const [latestUpdatedPagesRefreshTime, setLatestUpdatedPagesRefreshTime] =
    useState(getUnixtime());
  const [visaRedigeraFavoriter, setVisaRedigeraFavoriter] = useState(false);

  // Uppdatera refreshtime när route matchar /hem, dvs.
  // när Hem blir aktiv flik.
  useEffect(() => {
    if (!routeMatch) {
      return;
    }
    setLatestUpdatedPagesRefreshTime(getUnixtime());
  }, [routeMatch, latestUpdatedPagesRefreshTime]);

  const handlePageTextTVRefresh = (e) => {
    setLatestUpdatedPagesRefreshTime(getUnixtime());
  };

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
      <IonIcon slot="start" icon={starOutline} />
      <IonLabel>Ändra favoriter...</IonLabel>
    </IonItem>
  );

  return (
    <PageTextTV
      {...props}
      pageNum={userFavorites.pages.join(",")}
      title="TextTV.nu"
      headerStyle="HEADER_STYLE_STARTPAGE"
      refreshTime={latestUpdatedPagesRefreshTime}
      onRefresh={handlePageTextTVRefresh}
      editFavoritesButton={editFavoritesButton}
    >
      <RedigeraFavoriter
        isOpen={visaRedigeraFavoriter}
        pages={userFavorites.pages}
        handleSaveModal={(pages) => {
          // Spara till storage
          saveFavorites(pages);
          // Uppdatera sidor i context
          userFavorites.setPages(pages);
          // setFavoritePages(pages);
          setVisaRedigeraFavoriter(false);
          // Visa toast.
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
  );
};

export { Startsida };
