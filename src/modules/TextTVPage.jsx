/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import { isPlatform } from "@ionic/react";
import classNames from "classnames";
import { useEffect } from "react";
import {
  createMarkupForPage,
  getNearestLink,
  hidePageUpdatedToasts,
  logPageView,
} from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";
import { TextTVPageBreadcrumbs } from "./TextTVPageBreadcrumbs";
import { useTextTVPage } from "../hooks";

const TextTVPage = (props) => {
  const { pageNum, pageId, children, history, refreshTime, onPageUpdate } =
    props;

  const { pageData, pageIsLoading, error } = useTextTVPage(pageNum, pageId, refreshTime);

  // Leta upp närmaste länk, om någon, vid klick nånstans på sidan,
  // och gå till den länken.
  const handleClick = (e) => {
    const link = getNearestLink(e);

    // Baila om vi inte hittade länk.
    if (!link || link.nodeName !== "A") {
      return;
    }

    // Om det inte är en sida utan t.ex. en vanlig länk
    // så följer vi den som vanligt, dvs. låter sidan öppnas
    // i enhetens webbläsare.
    let target = link.getAttribute("target");
    if (target && target === "_blank") {
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
    const linkPageNum = href.replace(/\//g, "");

    // Göm ev synliga toasts.
    // TODO: göm toast via state och inte via query selector + api method
    hidePageUpdatedToasts();

    logPageView(linkPageNum, "click");

    const fullUrl = `/sidor${href}`;
    history.push(fullUrl);
  };

  /**
   * Kör uppdaterad-funktion från props.
   */
  useEffect(() => {
    if (onPageUpdate) {
      onPageUpdate(pageData);
    }
  }, [pageNum, pageData, onPageUpdate]);

  const classes = classNames({
    TextTVPage: true,
    "TextTVPage--isLoading": pageIsLoading,
    "TextTVPage--isDoneLoading": !pageIsLoading,
  });

  /**
   * Visar attribution/källa för aktuella text tv-sidor.
   *
   * @returns Array Attributions
   */
  const PagesAttribution = function () {
    return (
      <aside className="TextTVPage__attribution">
        <p>{pageData.length === 1 ? "Källa:" : "Källor:"}</p>
        <ul>
          {pageData.map((page) => {
            if (pageData && pageData.length) {
              return (
                <li key={page.num}>
                  svt.se/text-tv/{page.num} • Hämtad{" "}
                  {new Date(page.date_updated_unix * 1000).toLocaleString()}
                </li>
              );
            } else {
              return null;
            }
          })}
        </ul>
      </aside>
    );
  };

  // Lägg en `div` runt varje sida.
  const pagesHtml = (
    <>
      <TextTVPageBreadcrumbs pageData={pageData} />
      {pageData.map((page) => {
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
      })}
      <PagesAttribution />
    </>
  );

  return (
    <>
      {pageIsLoading && <SkeletonTextTVPage pageNum={pageNum} />}
      {error && !pageIsLoading && (
        <div className="TextTVPage__error">
          <p>Det gick inte att ladda sidan. Försök igen senare.</p>
          {error && <p className="TextTVPage__error-details">{error}</p>}
        </div>
      )}
      {!pageIsLoading && !error && pagesHtml}
    </>
  );
};

export { TextTVPage };
