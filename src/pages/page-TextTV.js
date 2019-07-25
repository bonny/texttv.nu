/**
 * Visar en sida med en eller flera text-tv-sidor.
 */
import { Plugins } from "@capacitor/core";
import { IonContent, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  getCurrentIonPageContentElm,
  getPageRangeInfo,
  getUnixtime,
  stripHtml
} from "../functions";
import Header from "../modules/Header";
import TextTVPage from "../modules/TextTVPage";
import TextTVRefresher from "../modules/TextTVRefresher";
import { useSwipeable } from "react-swipeable";

import easing from "../easing.js";
// console.log("easing", easing);

const { Clipboard, Share } = Plugins;

/**
 * Function from
 * https://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
 */
const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

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

  const maxDeltaMove = 125;
  const maxDeltaMoveNormalizedReversed = 0.7;
  const swipeConfig = {
    delta: 10,
    onSwiping: eventData => {
      const dir = eventData.dir;
      if (dir === "Left" || dir === "Right") {
        // console.log("onSwiping left or right", eventData);
        const absoluteDeltaX = Math.abs(eventData.deltaX);

        // The number of pixels to move the page.
        let deltaXForTransform = eventData.deltaX * -1;

        // DeltaX som värde mellan 0 och 1.
        // 0 = precis i början då vi precis börjat flytta i sidled,
        // 1 = max flytt i sidled, dvs vi har nått maxDeltaMove pixlar
        let deltaXNormalized = normalizeBetweenTwoRanges(
          absoluteDeltaX,
          0,
          maxDeltaMove,
          0,
          1
        );

        if (deltaXNormalized > 1) {
          // deltaXNormalized = 1;
        }

        const deltaXNormalizedWithEasing = easing.easeInCirc(deltaXNormalized);
        let deltaXNormalizedWithEasingReversed = 1 - deltaXNormalizedWithEasing;

        console.log(
          "maxDeltaMoveNormalized check",
          maxDeltaMoveNormalizedReversed,
          deltaXNormalized,
          maxDeltaMoveNormalizedReversed >= deltaXNormalizedWithEasingReversed
        );
        if (
          maxDeltaMoveNormalizedReversed >= deltaXNormalizedWithEasingReversed
        ) {
          deltaXNormalizedWithEasingReversed = maxDeltaMoveNormalizedReversed;
        }

        const absoluteDeltaXWithEasing =
          absoluteDeltaX * deltaXNormalizedWithEasingReversed;

        console.log("\n----\nabsoluteDeltaX", absoluteDeltaX);
        console.log("deltaXNormalized", deltaXNormalized);
        console.log("deltaXNormalizedWithEasing", deltaXNormalizedWithEasing);
        console.log(
          "deltaXNormalizedWithEasingReversed",
          deltaXNormalizedWithEasingReversed
        );
        console.log("deltaXForTransform", deltaXForTransform);
        console.log("absoluteDeltaXWithEasing", absoluteDeltaXWithEasing);

        deltaXForTransform = absoluteDeltaXWithEasing;
        console.log("deltaXForTransform after easing", deltaXForTransform);

        console.log(
          "maxDeltaMove - deltaXForTransform",
          maxDeltaMove - deltaXForTransform
        );
        console.log(
          "maxDeltaMove - absoluteDeltaX",
          maxDeltaMove - absoluteDeltaX
        );

        // Begränsa rörelse till max n i sidled och
        // är vi över den å släpper så går vi till sidan.
        if (absoluteDeltaX > maxDeltaMove) {
          // const numberOfPixelsAboveMax = absoluteDeltaX - maxDeltaMove;
          // const numberOfPixelsUntilMaxAbove =
          //   maxDeltaMoveAbove - numberOfPixelsAboveMax;
          // const numberOfPixelsAboveMaxEased = easing.easeOutCubic(
          //   numberOfPixelsAboveMax
          // );
          // y = y1 + (y2 - y1) * easeInOut(t);
          //console.log("numberOfPixelsAboveMax", numberOfPixelsAboveMax);
          // console.log(
          //   "numberOfPixelsAboveMaxEased",
          //   numberOfPixelsAboveMaxEased
          // );
          // console.log(
          //   "numberOfPixelsUntilMaxAbove",
          //   numberOfPixelsUntilMaxAbove
          // );
          // Normalisera antal pixel från max till ovan max.
          // let numberAboveMaxNormalized = normalizeBetweenTwoRanges(
          //   numberOfPixelsAboveMax,
          //   0,
          //   maxDeltaMove + maxDeltaMoveAbove,
          //   0,
          //   1
          // );
          // if (numberAboveMaxNormalized > 1) {
          //   numberAboveMaxNormalized = 1;
          // }
          // console.log("numberAboveMaxNormalized", numberAboveMaxNormalized);
          // Easing på normaliserade värdet
          // const numberAboveMaxNormalizedEased = easing.easeOutQuart(
          //   numberAboveMaxNormalized
          // );
          // console.log(
          //   "numberAboveMaxNormalizedEased",
          //   numberAboveMaxNormalizedEased
          // );
          // Värde att modifera flyttningen.
          // let moveModifierNum = 0;
          // if (numberOfPixelsUntilMaxAbove < 0) {
          //   moveModifierNum =
          //     numberAboveMaxNormalized *
          //     numberAboveMaxNormalized *
          //     numberOfPixelsAboveMax;
          // }
          // console.log("moveModifierNum", moveModifierNum);
        }
        // deltaXForTransform =
        //   deltaXForTransform > 0 ? maxDeltaMove : -maxDeltaMove;

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
        if (absoluteDeltaX > maxDeltaMove) {
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

  // console.log("PageTextTV for pageNum", pageNum);

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

  const handleShare = async e => {
    // Hämta alla sidorn IDn
    let pageIdsString = "";
    pageData.forEach(page => {
      pageIdsString = pageIdsString + `,${page.id}`;
    });

    // Bort med första kommatecknet.
    pageIdsString = pageIdsString.replace(/^,/, "");

    // Permalänk.
    const permalink = `https://www.texttv.nu/${pageNum}/arkiv/sida/${pageIdsString}`;

    // Titel + ev. text från första sidan.
    const firstPage = pageData[0];

    const sharePromise = Share.share({
      title: `Text TV ${firstPage.num}: ${firstPage.title}`,
      text: `${firstPage.title}
Delad via https://texttv.nu/`,
      url: permalink,
      dialogTitle: "Dela sida"
    });

    sharePromise
      .then(data => {
        console.log("Delning verkar gått fint. Härligt!", data);
        // Pinga denna efter delning för att meddela sajten att sidan delats.
        // I vanliga fall används denna för att hämta delningsinfo, men
        // det blir ett promise för mycket för att Safari ska godkänna delning.
        const apiEndpoint = "https://api.texttv.nu/api/share/" + pageIdsString;

        fetch(apiEndpoint);
        // TODO: Pixeltrack x2.
      })
      .catch(err => {
        console.log("Delning gick fel pga orsak", err);
      });
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
    const checkForUpdateInterval = 10000;
    let intervalId;
    const checkForUpdate = async () => {
      // hitta ID på sidan som har högst id och kolla den
      // http://texttv.nu/api/updated/100,300,700/1439310425
      // kod körs var femte sekund i existerande app
      // https://github.com/bonny/texttv.nu/blob/master/app/texttvnucodovaapp/www/js/texttv.backbone.app.js#L675
      // TODO: refreshTime blir för unik, använd cachebust eller riktigt timestamp från sida.
      var url = `https://api.texttv.nu/api/updated/${pageNum}/${refreshTime}`;
      // console.log("checkForUpdate url", url);

      const response = await fetch(url);
      const responseJson = await response.json();
      // setPageUpdatedToastVisible(true);
      if (responseJson.is_ok && responseJson.update_available) {
        setPageUpdatedToastVisible(true);
      }
    };

    intervalId = setInterval(checkForUpdate, checkForUpdateInterval);

    // Sluta leta efter uppdateringar vid cleanup.
    return () => {
      clearInterval(intervalId);
    };
  }, [pageNum, refreshTime]);

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handlePageUpdate = data => {
    // console.log("handlePageUpdate", data);
    setPageData(data);
  };

  const handleCopyTextToClipboard = () => {
    const pageRangeInfo = getPageRangeInfo(pageNum);

    let text = "";
    if (pageRangeInfo.count > 1) {
      text = text + `Text TV sidorna ${pageNum}.`;
    } else {
      text = text + `Text TV sidan ${pageNum}.`;
    }

    text = text + "\nDelat via https://texttv.nu.\n";

    pageData.forEach((page, idx) => {
      // Lägg till separator mellan sidor.
      //if (idx > 0) {
      text = text + "\n----------------------------------------\n\n";
      //}

      page.content.forEach(val => {
        text = text + val;
      });
    });

    text = stripHtml(text);

    Clipboard.write({
      string: text
    });
  };

  const handleCopyLinkToClipboard = () => {
    let pageIdsString = "";
    pageData.forEach(page => {
      pageIdsString = pageIdsString + `,${page.id}`;
    });

    pageIdsString = pageIdsString.replace(/^,/, "");

    const shareDate = new Date();
    const formattedDate = `${shareDate.getFullYear()}-${shareDate.getMonth() +
      1}-${shareDate.getDate()}`;

    const permalink = `https://texttv.nu/${pageNum}/arkiv/${formattedDate}/${pageIdsString}/`;

    Clipboard.write({
      string: permalink
    });
  };

  let debugcontainerstyles = {};
  const deltaXForTransform = swipeData.deltaXForTransform;
  if (swipeData && swipeData.doMove) {
    debugcontainerstyles = {
      transform: `translateX(${deltaXForTransform}px)`
    };
  }

  let firstPage;
  let pageNextNum;
  let pagePrevNum;
  let normalizedDelta;
  let TextTVNextPrevSwipeNavStyles;

  if (pageData && pageData.length && deltaXForTransform) {
    firstPage = pageData[0];
    pageNextNum = firstPage.next_page;
    pagePrevNum = firstPage.prev_page;
    normalizedDelta = normalizeBetweenTwoRanges(
      deltaXForTransform,
      0,
      maxDeltaMove,
      0,
      1
    );
    TextTVNextPrevSwipeNavStyles = {
      opacity: Math.abs(normalizedDelta)
    };
  }

  return (
    <>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        onShare={handleShare}
        onCopyTextToClipboard={handleCopyTextToClipboard}
        onCopyLinkToClipboard={handleCopyLinkToClipboard}
        handleRefreshBtnClick={handleRefreshBtnClick}
      />

      <IonContent color="dark">
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        {pagePrevNum && (
          <div
            className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--prev"
            style={TextTVNextPrevSwipeNavStyles}
          >
            « {pagePrevNum}
          </div>
        )}
        {pageNextNum && (
          <div
            className="TextTVNextPrevSwipeNav TextTVNextPrevSwipeNav--next"
            style={TextTVNextPrevSwipeNavStyles}
          >
            {pageNextNum} »
          </div>
        )}
        {/* {normalizedDelta && <p>normalizedDelta: {normalizedDelta}</p>} */}

        <div {...swipeHandlers}>
          <div style={debugcontainerstyles}>
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
          translucent={true}
          message={`En nyare version av sidan ${pageNum} finns.`}
          cssClass="TextTVPage_UpdatedToast"
          showCloseButton={false}
          color="dark"
          buttons={[
            {
              side: "end",
              text: "Ladda om",
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
    </>
  );
};

export default PageTextTV;
