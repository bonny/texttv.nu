/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import classNames from "classnames";
import { createMarkupForPage } from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";
import { TextTVPageBreadcrumbs } from "./TextTVPageBreadcrumbs";
import {
  useTextTVPage,
  useTextTVPageNavigation,
  useTextTVPageUpdate,
} from "../hooks";
import { TextTVPageAttribution } from "../components";

const TextTVPage = (props) => {
  const { pageNum, pageId, children, history, refreshTime, onPageUpdate } =
    props;

  const { pageData, pageIsLoading, error } = useTextTVPage(
    pageNum,
    pageId,
    refreshTime
  );
  const handleClick = useTextTVPageNavigation(history);
  useTextTVPageUpdate(onPageUpdate, pageData, pageNum);

  const classes = classNames({
    TextTVPage: true,
    "TextTVPage--isLoading": pageIsLoading,
    "TextTVPage--isDoneLoading": !pageIsLoading,
  });

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

      <TextTVPageAttribution pageData={pageData} />
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
