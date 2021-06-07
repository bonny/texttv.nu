/**
 * IonPage-sida som visar en sida med en eller flera text-tv-sidor.
 */
import {
  IonContent,
  IonIcon,
  IonPage,
  IonSlide,
  IonSlides,
  IonToast,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { caretBackCircle, caretForwardCircle } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getCurrentIonPageContentElm,
  getUnixtime,
  handleCopyLinkToClipboard,
  handleCopyTextToClipboard,
  handleOpenLinkInBrowser,
  handleShare,
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

  const contentRef = useRef();
  const sliderRef = useRef();

  let pageTitle = title || `${pageNum} - SVT Text TV`;

  const firstPage = pageData[0];
  const pageCurrentNum = firstPage ? parseInt(firstPage.num) : null;

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

    console.log(
      `Sida ${pageNum} dvs hem visas pga view enter med refreshTime ${refreshTime}, match.path ${match.path}. Ladda in sidan/sidorna, börja leta efter uppdateringar.`
    );

    updateRefreshTime();
  }, [pageNum, pageId, refreshTime, match.path]);

  useIonViewWillLeave(() => {
    console.log(
      `Sida ${pageNum} visas inte längre pga view leave. Sluta leta efter uppdateringar.`
    );
  }, [pageNum, pageId, refreshTime]);

  useEffect(() => {
    console.log(
      `Sida ${pageNum} visas med refreshTime ${refreshTime}. Ladda in sidan/sidorna, börja leta efter uppdateringar.`
    );

    return function cleanup() {
      console.log(
        `Sida ${pageNum} visas inte längre eller komponenten har monterats av. Sluta leta efter uppdateringar.`
      );
    };
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
    setTimeout(() => {
      e.target.complete();
    }, 500);
  };

  const handleRefreshBtnClick = (e) => {
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

    let intervalId;

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
        // console.log(
        //   `${pageNum} är inte synlig, så kollar inte efter uppdatering`
        // );
        doCheckForUpdate = false;
      } else if (pageUpdatedToastState.toastDismissed) {
        // console.log(
        //   `${pageNum} har redan kollats efter uppdatering och användare tryckte på cancel i toast, så kollar inte mer efter uppdatering`
        // );
        doCheckForUpdate = false;
      } else {
        // console.log(
        //   `${pageNum} är synlig, så letar efter uppdatering av sidan, via url ${url}`
        // );
      }

      console.log("checkForUpdate", pageNum);

      /*
      - Går från startsida till undersida = fortsätter leta efter uppdateringar för hem-sidorna.
      - Går från undersida t.ex. 135 till nyast = fortsätter leta efter uppdateringar
      - Går från sida med uppdatering-finns-toast till annan flik = toast visas fortfarande
      - Lagra i state vilken sida det är som faktiskt uppdaterats så vi slipper undra om det är 100, 300 eller 402.
      */

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
        console.log(
          "sidan som har en uppdatering är inte längre den aktiva, så visa inte toast"
        );
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
        console.log({ responseJson });
        setPageUpdatedToastState({
          ...pageUpdatedToastState,
          showToast: true,
          updatedText: updatedText,
        });
      }
    };

    intervalId = setInterval(checkForUpdate, checkForUpdateInterval);

    // Sluta leta efter uppdateringar vid cleanup.
    // @TODO: denna körs inte pga komponenten är kvar fast man navigerar bort.
    return () => {
      console.log("checkForUpdate, avbryt setInterval", pageNum);
      clearInterval(intervalId);
    };
  }, [pageNum, refreshTime, pageUpdatedToastState]);

  // Uppdatera dokument-titel när pageTitle ändras.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

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

  const sliderOptions = {
    initialSlide: 1,
  };

  const location = useLocation();

  const handleSlidesDidLoad = (e) => {
    // När slides körs på startsidan så blir det nån bugg som gör att slides Swiper
    // inte initieras helt korrekt på nåt vis och av nån anledning.
    // Eventligen beror detta på att på startsidan så visas mer innehåller under slider
    // komponenten tar mer än 20 ms att ladda?
    // update() på swiper verkar lösa detta.
    e.target.getSwiper().then((swiper) => {
      const checkInterval = 10;
      const maxNumberOfChecks = 10;
      let checkNum = 0;

      const checkIntervalId = setInterval(() => {
        const hasTranslateApplied =
          swiper.wrapperEl.style.cssText.indexOf("translate3d");

        if (checkNum > maxNumberOfChecks) {
          clearInterval(checkIntervalId);
        }

        if (hasTranslateApplied === -1) {
          swiper.update();
        } else {
          clearInterval(checkIntervalId);
        }

        checkNum++;
      }, checkInterval);
    });
  };

  /**
   * När man swipeat åt ett håll navigeras man iväg till den sidan
   * via en history.push().
   */
  const handleSlideDidChange = (e) => {
    if (!sliderRef.current) {
      return;
    }

    sliderRef.current.getActiveIndex().then((activeIndex) => {
      let navToPageNum;

      if (activeIndex === 0) {
        navToPageNum = pagePrevNum;
      } else if (activeIndex === 2) {
        navToPageNum = pageNextNum;
      }

      if (!navToPageNum) {
        return;
      }

      // Gå till sida och gå sedan tillbaka till slidern i mitten.
      history.push(`/sidor/${navToPageNum}`);
      // Får ibland på Vercel "Cannot read property 'slideTo' of null" trots att vi kollat denna tidigare.
      sliderRef?.current?.slideTo(1, 0);
      scrollToTop(0);
    });
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
        <IonSlides
          ref={sliderRef}
          pager={false}
          options={sliderOptions}
          onIonSlidesDidLoad={handleSlidesDidLoad}
          onIonSlideDidChange={handleSlideDidChange}
        >
          <IonSlide>
            <div className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--prev">
              <div className="TextTVNextPrevSwipeNav__inner">
                <IonIcon
                  className="TextTVNextPrevSwipeNav__icon"
                  icon={caretBackCircle}
                />
                <span className="TextTVNextPrevSwipeNav__number">
                  Gå till {pagePrevNum}
                </span>
              </div>
            </div>
          </IonSlide>

          <IonSlide>
            <div>
              <TextTVPage
                pageNum={pageNum}
                pageId={pageId}
                history={history}
                refreshTime={refreshTime}
                onPageUpdate={handlePageUpdate}
              />
            </div>
          </IonSlide>

          <IonSlide>
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
        </IonSlides>

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

        {children}
      </IonContent>
    </IonPage>
  );
};

export default PageTextTV;
