/**
 * IonPage-sida som visar en sida med en eller flera text-tv-sidor.
 */

import {
  IonPage,
  IonContent,
  IonIcon,
  IonToast,
  NavContext,
  IonSlide,
  IonSlides
} from "@ionic/react";
import { caretBackCircle, caretForwardCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState, useContext } from "react";
// import { useSwipeable } from "react-swipeable";
import {
  getCurrentIonPageContentElm,
  getUnixtime,
  // normalizeBetweenTwoRanges,
  handleCopyLinkToClipboard,
  handleCopyTextToClipboard,
  handleOpenLinkInBrowser,
  handleShare
} from "../functions";
import Header from "../modules/Header";
import TextTVPage from "../modules/TextTVPage";
import TextTVRefresher from "../modules/TextTVRefresher";

const PageTextTV = props => {
  const {
    match,
    history,
    title,
    headerStyle = "HEADER_STYLE_DEFAULT",
    children,
    refreshTime: passedRefreshTime,
    // Custom function att köra om refresh-knappen tryckts på.
    onRefresh
  } = props;

  const pageNum = props.pageNum || match.params.pageNum;
  const pageId = props.pageId || match.params.pageId;
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const [goNextEnabled, setGoNextEnabled] = useState(false);
  const [pageUpdatedToastVisible, setPageUpdatedToastVisible] = useState(false);
  const [pageData, setPageData] = useState([]);
  // const [swipeData, setSwipeData] = useState({
  //   doMove: false
  // });
  const [didDismissPageUpdateToast, setDidDismissPageUpdateToast] = useState(
    false
  );

  const contentRef = useRef();
  const pageRef = useRef();
  const sliderRef = useRef();
  // const maxDeltaNormalMove = 80;

  const navContext = useContext(NavContext);

  let pageTitle = title || `${pageNum} - SVT Text TV`;

  const firstPage = pageData[0];
  const pageCurrentNum = firstPage ? parseInt(firstPage.num) : null;
  const pagePrevNum = firstPage ? parseInt(firstPage.prev_page) : null;
  const pageNextNum = firstPage ? parseInt(firstPage.next_page) : null;

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(getUnixtime());
    if (onRefresh) {
      onRefresh();
    }
  };

  const handlePullToRefresh = e => {
    updateRefreshTime();
    setTimeout(() => {
      e.target.complete();
    }, 750);
  };

  const handleRefreshBtnClick = e => {
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
      scrollToTop();
      localUpdateRefreshTime();
    }
  }, [passedRefreshTime, refreshTime, onRefresh]);

  const scrollToTop = () => {
    let currentIonPageContent = getCurrentIonPageContentElm();
    if (currentIonPageContent) {
      currentIonPageContent.scrollToTop(750);
    }
  };

  // Leta efter uppdateringar av sidan eller sidorna
  // när pageNum eller refreshTime ändrats.
  useEffect(() => {
    const checkForUpdateInterval = 5000;
    let intervalId;
    const checkForUpdate = async () => {
      // hitta ID på sidan som har högst id och kolla den
      // http://texttv.nu/api/updated/100,300,700/1439310425
      // kod körs var femte sekund i existerande app
      // https://github.com/bonny/texttv.nu/blob/master/app/texttvnucodovaapp/www/js/texttv.backbone.app.js#L675
      // TODO: refreshTime blir för unik, använd cachebust eller riktigt timestamp från sida.

      var url = `https://api.texttv.nu/api/updated/${pageNum}/${refreshTime}`;

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
      } else if (didDismissPageUpdateToast) {
        // console.log(
        //   `${pageNum} har redan kollats efter uppdatering och användare tryckte på cancel i toast, så kollar inte mer efter uppdatering`
        // );
        doCheckForUpdate = false;
      } else {
        // console.log(
        //   `${pageNum} är synlig, så letar efter uppdatering av sidan, via url ${url}`
        // );
      }

      if (!doCheckForUpdate) {
        return;
      }

      const response = await fetch(url);
      const responseJson = await response.json();

      // Sätt denna till true för att fejka att
      // det alltid finns en uppdatering av sida.
      const fakeUpdateAvailable = false;

      // Kolla att sidan vi letat efter fortfarande är sidan som vi visar.
      // Användaren kan vara snabb så precis när en letning görs så byter de sida
      // och då kan en uppdatering som finns gälla föregående sida.
      const isHiddenPageAfterFetch = closestIonPage.matches(".ion-page-hidden");
      if (isHiddenPageAfterFetch) {
        // console.log(
        //   "sidan som har en uppdatering är inte längre den aktiva, så visa inte toast"
        // );
        return;
      }

      if (
        fakeUpdateAvailable ||
        (responseJson.is_ok && responseJson.update_available)
      ) {
        setPageUpdatedToastVisible(true);
      }
    };

    intervalId = setInterval(checkForUpdate, checkForUpdateInterval);

    // Sluta leta efter uppdateringar vid cleanup.
    return () => {
      clearInterval(intervalId);
    };
  }, [pageNum, refreshTime, didDismissPageUpdateToast]);

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  /**
   * Hämtar upp state från en texttv sida, så
   * vi här kommer åt sidans id osv.
   */
  const handlePageUpdate = data => {
    setPageData(data);
  };

  /**
   * När ny sida laddas in så nollställer vi att man gömt uppdaterings-toast.
   */
  useEffect(() => {
    setDidDismissPageUpdateToast(false);
  }, [pageNum]);

  // useEffect(() => {
  //   console.log("set go next disabled");
  //   setGoNextEnabled(false);
  // }, [pageNum, pageId]);

  /**
   * Göm uppdaterad-toast när vi lämnar sidan/vyn.
   */
  // useIonViewWillLeave(() => {
  //   console.log('useIonViewWillLeave');
  //   setPageUpdatedToastVisible(false);
  // })

  const sliderOptions = {
    initialSlide: 1
    // autoHeight: true
  };

  // const showPrevPageSlide = pageCurrentNum !== 100;
  // const showNextPageSlide = pageNextNum !== 999;
  // const showPrevPageSlide = true;
  // const showNextPageSlide = true;

  console.log("pageCurrentNum", pageCurrentNum, pageNextNum, pagePrevNum);
  const historyLocationPathname =
    history.location.pathname + "_" + history.location.key;
  console.log("history historyLocationPathname", historyLocationPathname);
  console.log("history", history.location.key);

  return (
    <IonPage ref={pageRef}>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        onShare={e => {
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

        <IonSlides
          ref={sliderRef}
          pager={false}
          options={sliderOptions}
          onIonSlideDidChange={e => {
            console.log("onIonSlideDidChange", e);
            console.log("pagePrevNum", pagePrevNum);
            console.log("pageNextNum", pageNextNum);
            sliderRef.current.getActiveIndex().then(activeIndex => {
              console.log("activeIndex", activeIndex);
              let navToPageNum;
              if (activeIndex === 0) {
                navToPageNum = pagePrevNum;
              } else if (activeIndex === 2) {
                navToPageNum = pageNextNum;
              }

              if (navToPageNum) {
                navContext.navigate(`/sidor/${navToPageNum}`, "none");
              }
            });
          }}
          onIonSlideNextEnd={e => {
            // navContext.navigate(`/sidor/${pageNextNum}`, "none");
            // Om initialSlide används och är mer än 0 så triggas detta event vid init av slider.
            // Så vi måste ignorera första eventet.
            // goNextEnabled
            // if (goNextEnabled) {
            //   console.log("GO NEXT YES");
            // } else {
            //   setGoNextEnabled(true);
            // }
            // Vi har 3 slides, om vi svept till höger men index är 1 så ska vi icke gå.
            // getActiveIndex
          }}
          onIonSlidePrevEnd={e => {
            console.log("slide prev", e);
            console.log("pagePrevNum", pagePrevNum, pageCurrentNum, history);
            // navContext.navigate(`/sidor/${pagePrevNum}`, "none");
          }}
          onIonSlidesDidLoad={e => {
            console.log("onOonSlidesDidLoad", e);
          }}
          key={historyLocationPathname}
        >
          <IonSlide key={historyLocationPathname + "_prev"}>
            <article>
              <IonIcon
                className="TextTVNextPrevSwipeNav__icon"
                icon={caretBackCircle}
              />
              <span className="TextTVNextPrevSwipeNav__number">
                Gå till {pagePrevNum}
              </span>
            </article>
          </IonSlide>

          <IonSlide key={historyLocationPathname + "_current"}>
            <article>
              <TextTVPage
                pageNum={pageNum}
                pageId={pageId}
                history={history}
                refreshTime={refreshTime}
                onPageUpdate={handlePageUpdate}
              />
            </article>
          </IonSlide>

          <IonSlide key={historyLocationPathname + "_next"}>
            <article>
              <span className="TextTVNextPrevSwipeNav__number">
                Gå till {pageNextNum}
              </span>
              <IonIcon
                className="TextTVNextPrevSwipeNav__icon"
                icon={caretForwardCircle}
              />
            </article>
          </IonSlide>
        </IonSlides>

        {children}

        {/* Toast med meddelande om att uppdatering av sidan finns. */}
        <IonToast
          isOpen={pageUpdatedToastVisible}
          onDidDismiss={() => {}}
          position="bottom"
          message="En nyare version av sidan finns."
          cssClass="TextTVPage_Toast TextTVPage_UpdatedToast"
          showCloseButton={false}
          buttons={[
            {
              side: "end",
              text: "Uppdatera",
              role: "confirm",
              handler: () => {
                setPageUpdatedToastVisible(false);
                updateRefreshTime();
              }
            },
            {
              side: "end",
              text: "✕",
              role: "confirm",
              handler: () => {
                // Göm toast.
                // För hur länge? För alltid? För alltid för denna sida? Bara för denna uppdatering?
                setPageUpdatedToastVisible(false);
                setDidDismissPageUpdateToast(true);
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default PageTextTV;
