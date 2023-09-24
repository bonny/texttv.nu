/**
 * IonPage-sida som visar en sida med en eller flera text-tv-sidor.
 */
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonToast,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonFooter,
} from "@ionic/react";
import { caretBackCircle, caretForwardCircle } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
  getCurrentIonPageContentElm,
  getUnixtime,
  handleCopyLinkToClipboard,
  handleCopyTextToClipboard,
  handleOpenLinkInBrowser,
  handleShare,
  logPageView,
} from "../functions";
import Header from "../modules/Header";
import { TextTVPage } from "../modules/TextTVPage";
import TextTVRefresher from "../modules/TextTVRefresher";

const scrollToTop = (speed = 750) => {
  let currentIonPageContent = getCurrentIonPageContentElm();
  if (currentIonPageContent) {
    currentIonPageContent.scrollToTop(speed);
  }
};

const PageTextTV = (props) => {
  const {
    match,
    history,
    title,
    children,
    refreshTime: passedRefreshTime,
    // Custom function att köra om refresh-knappen tryckts på.
    onRefresh,
  } = props;

  // Sidnummer att visa. Kan vara flera separerade med kommatecken, t.ex. "100,300,700".
  const pageNum = props.pageNum || match.params.pageNum;
  const pageId = props.pageId || match.params.pageId;

  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const [pageUpdatedToastState, setPageUpdatedToastState] = useState({
    showToast: false,
    pageNums: [],
    updatedText: "",
    toastDismissed: false,
  });
  const [pageData, setPageData] = useState([]);

  // Ref till ion-content-elementet.
  const contentRef = useRef();

  // Ref som används för att hålla kolla på ID från setInterval.
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const checkForUpdateIntervalId = useRef();

  const firstPage = pageData[0];

  const pageCurrentNum = firstPage ? parseInt(firstPage.num) : null;

  let pageTitle = title || `${pageNum} - SVT Text TV`;

  // @TODO: gå till nästa sida som finns enligt API-svar, inte till tom sida.
  // dock om man låter en sida vara öppen en stund så kan nästa/föregående sida ha förändrats,
  // så en sida som var tom har plötsligt fått innehåll. Eller tvärtom.
  let pagePrevNum = pageCurrentNum ? pageCurrentNum - 1 : null;
  let pageNextNum = pageCurrentNum ? pageCurrentNum + 1 : null;

  if (pagePrevNum && pagePrevNum < 100) {
    pagePrevNum = 100;
  }

  if (pageNextNum && pageNextNum > 999) {
    pageNextNum = 999;
  }

  /*
  Få event när sida laddas in så vi kan:
  - ladda in sidan
  - börja kolla om uppdateringar finns

  Få event när sidan inte visas längre, pga byter till annan sida eller flik så vi kan:
  - sluta leta efter uppdateringar
  */

  useIonViewWillEnter(() => {
    // Baila om inte startsidan/hem.
    if (match.path !== "/hem") {
      return;
    }

    updateRefreshTime();
  }, [pageNum, pageId, refreshTime, match.path]);

  /**
   * När man byter flik ska vi:
   * - sluta leta efter uppdateringar av sidan.
   * - gömma uppdatering-finns-toast.
   */
  useIonViewWillLeave(() => {
    stopCheckForUpdates({
      reason: "checkForUpdate, avbryt setInterval pga view will leave",
    });

    setPageUpdatedToastState((oldState) => {
      return {
        ...oldState,
        showToast: false,
      };
    });
  }, [pageNum, pageId, refreshTime]);

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(getUnixtime());
    if (onRefresh) {
      onRefresh();
    }
  };

  const handlePullToRefresh = (e) => {
    updateRefreshTime();
    logPageView(pageNum, "pullToRefresh");
    setTimeout(() => {
      e.target.complete();
    }, 500);
  };

  const handleRefreshBtnClick = (e) => {
    logPageView(pageNum, "reloadButton");
    updateRefreshTime();
  };

  // Om refreshTime som skickas med är mer än vår
  // egna refreshTime så uppdaterar vi vår egna
  // för att få en uppdatering.
  useEffect(() => {
    const localUpdateRefreshTime = () => {
      setRefreshTime(getUnixtime());
      if (onRefresh) {
        onRefresh();
      }
    };

    if (passedRefreshTime > refreshTime) {
      scrollToTop(0);
      localUpdateRefreshTime();
    }
  }, [passedRefreshTime, refreshTime, onRefresh]);

  // Leta efter uppdateringar av sidan eller sidorna
  // när pageNum eller refreshTime ändrats.
  useEffect(() => {
    // Hur ofta i millisekunder vi ska leta efter uppdatering av en sida.
    const checkForUpdateInterval = 5000;

    // Kolla med servern om nyare version av någon av sidorna finns.
    const checkForUpdate = async () => {
      // hitta ID på sidan som har högst id och kolla den
      // http://texttv.nu/api/updated/100,300,700/1439310425
      // kod körs var femte sekund i existerande app
      // https://github.com/bonny/texttv.nu/blob/master/app/texttvnucodovaapp/www/js/texttv.backbone.app.js#L675
      // @TODO: refreshTime blir för unik, använd cachebust eller riktigt timestamp från sida.
      var url = `https://api.texttv.nu/api/updated/${pageNum}/${refreshTime}`;

      // @TODO: crashar ibland.
      const closestIonPage = contentRef.current.closest(".ion-page");
      const isHiddenPage = closestIonPage.matches(".ion-page-hidden");
      let doCheckForUpdate = true;

      // Men kolla bara om den här sidan är sidan som faktiskt är den aktiva.
      // Kolla inte heller efter uppdatering om toast för uppdatering
      // har visats för denna sida redan.
      if (isHiddenPage) {
        // `${pageNum} är inte synlig, så kollar inte efter uppdatering`
        doCheckForUpdate = false;
      } else if (pageUpdatedToastState.toastDismissed) {
        // `${pageNum} har redan kollats efter uppdatering och användare tryckte på cancel i toast, så kollar inte mer efter uppdatering`
        doCheckForUpdate = false;
      } else {
        // `${pageNum} är synlig, så letar efter uppdatering av sidan, via url ${url}`
      }

      if (!doCheckForUpdate) {
        return;
      }

      const response = await fetch(url);
      const responseJson = await response.json();

      /*
      Json är ca såhär:
      {
        "is_ok": true,
        "update_available": true,
        "res": [
          {
            "id": "30365020",
            "page_num": "127",
            "date_updated": "2021-06-07 20:56:13",
            "title": "Bol\u00e5n Nordea s\u00e4nker kalkylr\u00e4ntan f\u00f6r",
            "date_added": "2021-06-07 20:56:13"
          },
          {
            "id": "30365019",
            "page_num": "118",
            "date_updated": "2021-06-07 20:56:10",
            "title": "Damberg (S): Stolt \u00f6ver svensk polis",
            "date_added": "2021-06-07 20:56:10"
          }
        ]
      }

      */

      // Sätt denna till true för att fejka att
      // det alltid finns en uppdatering av sida.
      const fakeUpdateAvailable = false;

      // Kolla att sidan vi letat efter fortfarande är sidan som vi visar.
      // Användaren kan vara snabb så precis när en letning görs så byter de sida
      // och då kan en uppdatering som finns gälla föregående sida.
      const isHiddenPageAfterFetch = closestIonPage.matches(".ion-page-hidden");
      if (isHiddenPageAfterFetch) {
        // Sidan som har en uppdatering är inte längre den aktiva, så visa inte toast".
        return;
      }

      if (
        fakeUpdateAvailable ||
        (responseJson.is_ok && responseJson.update_available)
      ) {
        const pageNums = responseJson.res.map((vals) => vals.page_num);
        const updatedText =
          pageNums.length > 1
            ? `Sidorna ${pageNums.join(", ")} har uppdateringar`
            : `Sidan ${pageNums.join("")} har en uppdatering`;

        setPageUpdatedToastState((oldState) => {
          return {
            ...oldState,
            showToast: true,
            updatedText: updatedText,
          };
        });
      }
    };

    const intervalId = setInterval(checkForUpdate, checkForUpdateInterval);
    checkForUpdateIntervalId.current = intervalId;

    // Sluta leta efter uppdateringar vid cleanup, t.ex. när sidnummer ändras.
    // Körs dock inte när man går till annan flik pga det är en annan komponent som renderas.
    return () => {
      stopCheckForUpdates({
        reason: "checkForUpdate, avbryt setInterval pga effect cleanup",
      });
    };
  }, [pageNum, refreshTime, pageUpdatedToastState.toastDismissed]);

  // Uppdatera dokument-titel när pageTitle ändras.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const stopCheckForUpdates = ({ reason }) => {
    clearInterval(checkForUpdateIntervalId.current);
  };

  /**
   * Hämtar upp state från en texttv sida, så
   * vi här kommer åt sidans id osv.
   */
  const handlePageUpdate = (data) => {
    setPageData(data);
  };

  /**
   * När ny sida laddas in så nollställer vi att man gömt uppdaterings-toast.
   */
  useEffect(() => {
    setPageUpdatedToastState((prevState) => {
      return {
        ...prevState,
        toastDismissed: false,
      };
    });
  }, [pageNum]);

  // Go to prev page.
  const handleFabPrevClick = () => {
    if (pagePrevNum) {
      logPageView(pagePrevNum, "fabPrevClick");
      history.push(`/sidor/${pagePrevNum}`);
    }
  };

  // Go to next page.
  const handleFabPrNextClick = () => {
    if (pageNextNum) {
      logPageView(pageNextNum, "fabNextClick");
      history.push(`/sidor/${pageNextNum}`);
    }
  };

  return (
    <IonPage>
      <Header
        {...props}
        pageTitle={pageTitle}
        onShare={(e) => {
          handleShare(e, pageData, pageNum);
        }}
        onCopyTextToClipboard={() => {
          handleCopyTextToClipboard(pageData, pageNum);
        }}
        onCopyLinkToClipboard={() => {
          handleCopyLinkToClipboard(pageData, pageNum);
        }}
        onOpenLinkInBrowser={() => {
          handleOpenLinkInBrowser(pageData, pageNum);
        }}
        handleRefreshBtnClick={handleRefreshBtnClick}
      />

      <IonContent ref={contentRef}>
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        {/*         <p>
          <strong>Debug:</strong>
          <br />
          pagenum: {pageNum}
          <br />
          passedRefreshTime: {passedRefreshTime}
          <br />
          pageId: {pageId}
          <br />
          match.path: {match.path}
          <br />
          match.url: {match.url}
          <br />
          location.key: {location.key}
          <br />
          refreshTime: {refreshTime}
        </p>
 */}
        {/* <IonSlides
          pager={false}
          options={sliderOptions}
          onIonSlidesDidLoad={handleSlidesDidLoad}
          onIonSlideDidChange={handleSlideDidChange}
        >
          <IonSlide> */}
        {/* <div className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--prev">
              <div className="TextTVNextPrevSwipeNav__inner">
                <IonIcon
                  className="TextTVNextPrevSwipeNav__icon"
                  icon={caretBackCircle}
                />
                <span className="TextTVNextPrevSwipeNav__number">
                  Gå till {pagePrevNum}
                </span>
              </div>
            </div> */}
        {/* </IonSlide> */}

        {/* <IonSlide> */}
        <div>
          <TextTVPage
            pageNum={pageNum}
            pageId={pageId}
            history={history}
            refreshTime={refreshTime}
            onPageUpdate={handlePageUpdate}
          />
        </div>
        {/* </IonSlide> */}

        {/* <IonSlide>
            <div className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--next">
              <div className="TextTVNextPrevSwipeNav__inner">
                <span className="TextTVNextPrevSwipeNav__number">
                  Gå till {pageNextNum}
                </span>
                <IonIcon
                  className="TextTVNextPrevSwipeNav__icon"
                  icon={caretForwardCircle}
                />
              </div>
            </div>
          </IonSlide>
        </IonSlides> */}

        {/* Toast med meddelande om att uppdatering av sidan finns. */}
        <IonToast
          isOpen={pageUpdatedToastState.showToast}
          onDidDismiss={() => {}}
          position="bottom"
          message={pageUpdatedToastState.updatedText}
          cssClass="TextTVPage_Toast TextTVPage_UpdatedToast"
          showCloseButton={false}
          buttons={[
            {
              side: "end",
              text: "Uppdatera",
              role: "confirm",
              handler: () => {
                setPageUpdatedToastState({
                  ...pageUpdatedToastState,
                  showToast: false,
                });
                updateRefreshTime();
              },
            },
            {
              side: "end",
              text: "✕",
              role: "confirm",
              handler: () => {
                // Göm toast utan att uppdatera sidan.
                // @TODO: Bestäm för hur länge? För alltid? För alltid för denna sida? Bara för denna uppdatering?
                setPageUpdatedToastState({
                  ...pageUpdatedToastState,
                  showToast: false,
                  toastDismissed: true,
                });
              },
            },
          ]}
        />

        {pageCurrentNum > 100 ? (
          <IonFab slot="fixed" vertical="bottom" horizontal="start">
            <IonFabButton
              color={"dark"}
              translucent={true}
              onClick={handleFabPrevClick}
              size="small"
            >
              <IonIcon icon={caretBackCircle} color="tertiary"></IonIcon>
            </IonFabButton>
          </IonFab>
        ) : null}
        {pageCurrentNum < 999 ? (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              color={"dark"}
              translucent={true}
              onClick={handleFabPrNextClick}
              size="small"
            >
              <IonIcon icon={caretForwardCircle} color="tertiary"></IonIcon>
            </IonFabButton>
          </IonFab>
        ) : null}

        {children}
      </IonContent>
    </IonPage>
  );
};

export default PageTextTV;
