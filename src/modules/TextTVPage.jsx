/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import React, { useEffect, useState, useRef, useContext } from "react";
import { NavContext } from "@ionic/react";
import {
  createMarkupForPage,
  getNearestLink,
  getCacheBustTimeString,
  hidePageUpdatedToasts,
  sendStats
} from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";
import classNames from "classnames";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default props => {
  const {
    pageNum,
    pageId,
    children,
    history,
    refreshTime,
    onPageUpdate
  } = props;

  const [pageData, setPageData] = useState([]);
  const prevPageNum = usePrevious(pageNum);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [pageIsLoadingNewPageRange, setPageIsLoadingNewPageRange] = useState(
    true
  );

  const navContext = useContext(NavContext);

  // Leta upp närmaste länk, om någon, vid klick nånstans på sidan,
  // och gå till den länken.
  const handleClick = e => {
    const link = getNearestLink(e);

    // Baila om vi inte hittade länk.
    if (!link || link.nodeName !== "A") {
      return;
    }

    // Detta är en länk, så låt oss följa den.
    e.preventDefault();

    // href is '/100', '/101-102', '150,163'
    let href = link.getAttribute("href");

    // Make sure string begins with "/".
    if (!href.startsWith("/")) {
      href = `/${href}`;
    }

    // Göm ev synliga toasts.
    // TODO: göm toast via state och inte via query selector + api method
    hidePageUpdatedToasts();

    // Om sökväg är t.ex "/sidor/100" så ger detta "sidor".
    const firstPathName = history.location.pathname
      .split("/")
      .filter(e => e)
      .find(e => true);

    // Gå till sida 🎉.
    let pathPrefix;
    switch (firstPathName) {
      case "hem":
        pathPrefix = "hem";
        break;
      case "sidor":
      default:
        pathPrefix = "sidor";
    }

    const timestamp = Date.now();
    navContext.navigate(`/${pathPrefix}${href}?date=${timestamp}`, "none");
  };

  // När sidan ändras så vill vi sätta innehållet till inget så att inte gamla innehållet
  // syns för en kort stund. Verkar inte funka så bra dock..
  useEffect(() => {
    if (pageNum !== prevPageNum) {
      setPageData([]);
      setPageIsLoadingNewPageRange(true);
    }
  }, [pageNum, pageId, refreshTime, prevPageNum]);

  /**
   * Ladda in sida från API när pageNum eller refreshTime ändras.
   */
  useEffect(() => {
    setPageIsLoading(true);

    async function fetchPageContents() {
      // Baila om ingen sida är satt.
      if (!pageNum && !pageId) {
        return;
      }

      // Hämta senaste sidan om bara pageNum,
      // hämta arkiv-sida om pageId
      let url;

      // Set to seconds integer to fake a slow answer.
      const slowAnswer = false;
      let slowAnswerQueryString = slowAnswer
        ? `&slow_answer=${slowAnswer}`
        : "";

      // Gruppera API-anrop genom cachebuster-sträng.
      const cacheBustTimeString = getCacheBustTimeString(15);

      if (pageId) {
        url = `https://api.texttv.nu/api/getid/${pageId}/${pageNum}?cb=${cacheBustTimeString}app=texttvapp${slowAnswerQueryString}`;
      } else {
        url = `https://api.texttv.nu/api/get/${pageNum}?cb=${cacheBustTimeString}&app=texttvapp${slowAnswerQueryString}`;
      }

      fetch(url)
        .then(async responseDatas => {
          const pageData = await responseDatas.json();

          setPageData(pageData);
          setPageIsLoading(false);
          sendStats(pageData, "view");
        })
        .catch(fetchErr => {
          console.log("Fel vid hämtning av sida:", fetchErr);
        });
    }

    fetchPageContents();
  }, [pageNum, pageId, refreshTime]);

  /**
   * Kör uppdaterad-funktion från props.
   */
  useEffect(() => {
    if (onPageUpdate) {
      onPageUpdate(pageData);
    }
  }, [pageNum, pageData, onPageUpdate]);

  const classes = classNames({
    "TextTVPage--isLoadingNewPageRange": pageIsLoadingNewPageRange,
    TextTVPage: true
  });

  // Wrap each page.
  const pagesHtml = pageData.map(page => {
    return (
      <div
        className={classes}
        key={page.id}
        data-page-num={pageNum}
        data-page-id={pageId}
      >
        <div className="TextTVPage__wrap">
          <div
            className="TextTVPage__inner"
            onClick={handleClick}
            dangerouslySetInnerHTML={createMarkupForPage(page)}
          />
        </div>
        {children}
      </div>
    );
  });

  return (
    <>
      {pageIsLoading && <SkeletonTextTVPage pageNum={pageNum} />}
      {!pageIsLoading && pagesHtml}
    </>
  );
};
