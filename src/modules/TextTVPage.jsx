/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import { isPlatform } from "@ionic/react";
import classNames from "classnames";
import {
  createMarkupForPage,
} from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";
import { TextTVPageBreadcrumbs } from "./TextTVPageBreadcrumbs";
import { useTextTVPage, useTextTVPageNavigation, useTextTVPageUpdate } from "../hooks";

const TextTVPage = (props) => {
  const { pageNum, pageId, children, history, refreshTime, onPageUpdate } =
    props;

  const { pageData, pageIsLoading, error } = useTextTVPage(pageNum, pageId, refreshTime);
  const handleClick = useTextTVPageNavigation(history);
  useTextTVPageUpdate(onPageUpdate, pageData, pageNum);

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
