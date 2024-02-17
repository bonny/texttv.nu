import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { starOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { getUnixtime, saveFavorites } from "../functions";
import { RedigeraFavoriter } from "../modules/RedigeraFavoriter";
import { SenastUppdaterat } from "../modules/SenastUppdaterat";
import PageTextTV from "./page-TextTV.js";
import { useRef } from "react";

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

  // Om Androidanvändare har satt sin font-storlek till större i systemet,
  // så kommer texten att bli för stor och hamna utanför skärmen.
  // Därför kollar vi om texten är för stor och sätter då en mindre font-storlek.
  // Sätter bara texten ett steg mindre men funkar för de flesta. 🤞
  const LargeFontDetector = () => {
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [elmWidth, setElmWidth] = useState();
    const debugElmRef = useRef();

    const handleResize = () => {
      setWindowInnerWidth(window.innerWidth);
      setElmWidth(debugElmRef.current.clientWidth);
      console.log('handleResize', debugElmRef.current.clientWidth);
    };

    useEffect(() => {
      setElmWidth(debugElmRef.current.clientWidth);

      // If window is larger than element, make element font size smaller.
      if (elmWidth > windowInnerWidth) {
        var prevValue = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--text-tv-font-size");

        var newValue = `${parseFloat(prevValue) - 0.02}vw`;

        // Set new value.
        document.documentElement.style.setProperty(
          "--text-tv-font-size",
          newValue
        );

        // Get new values
        setElmWidth(debugElmRef.current.clientWidth);
      }

      // Attach the event listener to the window object
      window.addEventListener("resize", handleResize);

      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [elmWidth, windowInnerWidth]);

    return (
      <div className="LargeFontDetector">
        <div className="TextTVPage">
          {/* The next span is 40 chars wide */}
          <span className="line dynamic" ref={debugElmRef}>
            Lorem ipsum dolor sit amet dynamic abcde
          </span>
        </div>
        <div>
          <p>Window inner width: {windowInnerWidth}</p>
          <p>Test elm width: {elmWidth}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <LargeFontDetector />

      <PageTextTV
        {...props}
        pageNum={userFavorites.pages.join(",")}
        title="TextTV.nu"
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
    </>
  );
};

export { Startsida };
