/**
 * IonPage-sida som visar en sida med en eller flera text-tv-sidor.
 */

 import {
  IonPage,
  IonContent,
  IonIcon,
  IonToast,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave
} from "@ionic/react";
import { arrowDropleftCircle, arrowDroprightCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import {
  getCurrentIonPageContentElm,
  getUnixtime,
  normalizeBetweenTwoRanges,
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
  const [pageUpdatedToastVisible, setPageUpdatedToastVisible] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [swipeData, setSwipeData] = useState({
    doMove: false
  });
  const [didDismissPageUpdateToast, setDidDismissPageUpdateToast] = useState(
    false
  );

  const contentRef = useRef();
  const pageRef = useRef();

  const maxDeltaNormalMove = 80;
  const swipeConfig = {
    delta: 10,
    onSwiping: eventData => {
      const dir = eventData.dir;
      if (dir === "Left" || dir === "Right") {
        // console.log("onSwiping", eventData);
        // console.log("onSwiping left or right", eventData);
        const absoluteDeltaX = Math.abs(eventData.deltaX);

        // The number of pixels to move the page.
        let deltaXForTransform = eventData.deltaX * -1;

        // Gör rörelser "segare" när vi kommit över en gräns.
        if (absoluteDeltaX > maxDeltaNormalMove) {
          const numberOfXMoreThanNormal = absoluteDeltaX - maxDeltaNormalMove;

          // Make this number increase in smaller and smaller steps.
          let numberOfXToAdd = numberOfXMoreThanNormal;
          numberOfXToAdd = numberOfXToAdd * 0.15;

          if (dir === "Left") {
            deltaXForTransform = -maxDeltaNormalMove - numberOfXToAdd;
          } else {
            deltaXForTransform = maxDeltaNormalMove + numberOfXToAdd;
          }
        }

        setSwipeData({
          doMove: true,
          deltaXForTransform: deltaXForTransform,
          absoluteDeltaX: absoluteDeltaX,
          dir: dir,
          deltaX: eventData.deltaX
        });
      } else {
        setSwipeData({
          doMove: false
        });
      }
    },
    onSwiped: eventData => {
      const dir = eventData.dir;
      if (dir === "Left" || dir === "Right") {
        const absoluteDeltaX = Math.abs(eventData.deltaX);
        const firstPage = pageData[0];
        const prevPage = firstPage.prev_page;
        const nextPage = firstPage.next_page;

        // Om vi släppte swipen och var mer än deltaMax = gå till sida.
        if (absoluteDeltaX > maxDeltaNormalMove) {
          // console.log("swiped left or right and more than deltamax", eventData);
          // console.log("prev and next pageNum", prevPage, nextPage);

          setSwipeData({
            doMove: false
          });

          if (dir === "Left") {
            // console.log("Gå till nästa sida, dvs. ", nextPage);
            history.push(`/sidor/${nextPage}`);
          } else if (dir === "Right") {
            // console.log("Gå till föregående sida, dvs. ", prevPage);
            history.push(`/sidor/${prevPage}`);
          }
        } else {
          // Om vi släppte men inte var mer än maxdelta = återgå till standard,
          // dvs. ångra svepning som påbörjats.
          setSwipeData({
            doMove: false
          });
        }
      }
    }
  };

  const swipeHandlers = useSwipeable(swipeConfig);

  let pageTitle = title || `${pageNum} - SVT Text TV`;

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(getUnixtime());
    if (onRefresh) {
      // console.log("call onRefresh in updateRefreshTime", onRefresh);
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
        // console.log("call onRefresh in useEffect", onRefresh);
        onRefresh();
      }
    };

    if (passedRefreshTime > refreshTime) {
      console.log(
        "page-texttv passedRefreshTime > refreshTime",
        passedRefreshTime,
        refreshTime
      );
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
        console.log(
          "sidan som har en uppdatering är inte längre den aktiva, så visa inte toast"
        );
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
    // console.log("intervalId", intervalId);

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
    // console.log("handlePageUpdate", data);
    setPageData(data);
  };

  /**
   * När ny sida laddas in så nollställer vi att man gömt uppdaterings-toast.
   */
  useEffect(() => {
    setDidDismissPageUpdateToast(false);
  }, [pageNum]);

  let firstPage;
  let pageNextNum;
  let pagePrevNum;
  let normalizedDelta;
  let TextTVNextPrevSwipeNavStyles;
  let swipeDirection = swipeData.dir;
  const deltaXForTransform = swipeData.deltaXForTransform;

  if (pageData && pageData.length && deltaXForTransform) {
    // console.log("swipeData", swipeData);
    firstPage = pageData[0];
    pageNextNum = firstPage.next_page;
    pagePrevNum = firstPage.prev_page;
    normalizedDelta = normalizeBetweenTwoRanges(
      deltaXForTransform,
      0,
      maxDeltaNormalMove,
      0,
      1
    );
    TextTVNextPrevSwipeNavStyles = {
      opacity: Math.abs(normalizedDelta)
    };
  }

  let swipecontainerStyles = {};

  if (swipeData && swipeData.doMove) {
    swipecontainerStyles = {
      transform: `translateX(${deltaXForTransform}px)`,
      opacity: 1 - Math.abs(normalizedDelta) / 3
    };
  }

  useIonViewDidEnter(e => {
    console.log("ionViewDidEnter event fired");
    console.log("pageRef", pageRef);
  });

  useIonViewDidLeave(() => {
    console.log("ionViewDidLeave event fired");
  });

  useIonViewWillEnter(() => {
    console.log("ionViewWillEnter event fired");
  });

  useIonViewWillLeave(() => {
    console.log("ionViewWillLeave event fired");
  });

  return (
    <IonPage ref={pageRef}>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        onShare={e => {
          handleShare(e, pageData);
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

        {pagePrevNum && swipeDirection === "Right" && (
          <div
            className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--prev"
            style={TextTVNextPrevSwipeNavStyles}
          >
            <IonIcon
              className="TextTVNextPrevSwipeNav__icon"
              icon={arrowDropleftCircle}
            />
            <span className="TextTVNextPrevSwipeNav__number">
              {pagePrevNum}
            </span>
          </div>
        )}
        {pageNextNum && swipeDirection === "Left" && (
          <div
            className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--next"
            style={TextTVNextPrevSwipeNavStyles}
          >
            <span className="TextTVNextPrevSwipeNav__number">
              {pageNextNum}
            </span>
            <IonIcon
              className="TextTVNextPrevSwipeNav__icon"
              icon={arrowDroprightCircle}
            />
          </div>
        )}
        {/* {normalizedDelta && <p>normalizedDelta: {normalizedDelta}</p>} */}

        <div {...swipeHandlers}>
          <div style={swipecontainerStyles}>
            {/* dir: {swipeData.dir}
            deltaX: {swipeData.deltaX} */}
            <TextTVPage
              pageNum={pageNum}
              pageId={pageId}
              history={history}
              refreshTime={refreshTime}
              size="large"
              onPageUpdate={handlePageUpdate}
            />
          </div>
        </div>

        {children}

        {/* Toast med meddelande om att uppdatering av sidan finns. */}
        <IonToast
          isOpen={pageUpdatedToastVisible}
          onDidDismiss={() => {}}
          position="bottom"
          message="En nyare version av sidan finns."
          cssClass="TextTVPage_Toast TextTVPage_UpdatedToast"
          showCloseButton={false}
          // color="medium"
          buttons={[
            {
              side: "end",
              text: "Uppdatera",
              role: "confirm",
              handler: () => {
                // console.log("refresh clicked");
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
                // console.log("close toast clicked");
                setPageUpdatedToastVisible(false);
                setDidDismissPageUpdateToast(true);
                // updateRefreshTime();
              }
            }
            // {
            //   text: "Ok",
            //   role: "cancel",
            //   handler: () => {
            //     console.log("Cancel clicked");
            //   }
            // }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default PageTextTV;
