/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  createMarkupForPage,
  getCacheBustTimeString,
  getNearestLink,
  hidePageUpdatedToasts,
  sendStats,
  logPageView,
} from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";

const TextTVPage = (props) => {
  const { pageNum, pageId, children, history, refreshTime, onPageUpdate } =
    props;

  const [pageData, setPageData] = useState([]);
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const [pageIsDoneLoading, setPageIsDoneLoading] = useState(false);

  // Leta upp närmaste länk, om någon, vid klick nånstans på sidan,
  // och gå till den länken.
  const handleClick = (e) => {
    const link = getNearestLink(e);

    // Baila om vi inte hittade länk.
    if (!link || link.nodeName !== "A") {
      return;
    }

    // Följ inte länken eftersom vi pushar manuellt till history.
    e.preventDefault();

    // href is '/100', '/101-102', '150,163'
    let href = link.getAttribute("href");

    // Make sure string begins with "/".
    if (!href.startsWith("/")) {
      href = `/${href}`;
    }

    // Also keep version of href without / for stats.
    const linkPageNum = href.replaceAll("/", "");

    // Göm ev synliga toasts.
    // TODO: göm toast via state och inte via query selector + api method
    hidePageUpdatedToasts();

    logPageView(linkPageNum, "click");

    const fullUrl = `/sidor${href}`;
    history.push(fullUrl);
  };

  /**
   * Ladda in sida från API när pageNum eller refreshTime ändras.
   */
  useEffect(() => {
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
        .then(async (responseDatas) => {
          // Sida är laddad.
          const pageData = await responseDatas.json();

          setPageData(pageData);
          setPageIsLoading(false);
          setPageIsDoneLoading(true);
          sendStats(pageData, "view");
        })
        .catch((fetchErr) => {
          // Fel vid hämtning av sida.
        });
    }

    setPageIsLoading(true);
    setPageIsDoneLoading(false);
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
    "TextTVPage--isLoading": pageIsLoading,
    "TextTVPage--isDoneLoading": pageIsDoneLoading,
    TextTVPage: true,
  });

  // Lägg en `div` runt varje sida.
  const pagesHtml = pageData.map((page) => {
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

export { TextTVPage };
