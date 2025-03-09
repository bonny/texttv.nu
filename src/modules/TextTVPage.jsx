/**
 * En text-tv-sida som visas i en IonPage.
 * Visas i en befintlig sida alltså.
 */
import classNames from "classnames";
import { createMarkupForPage, logPageView } from "../functions";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";
import { TextTVPageBreadcrumbs } from "./TextTVPageBreadcrumbs";
import {
  useTextTVPage,
  useTextTVPageNavigation,
  useTextTVPageUpdate,
} from "../hooks";
import { TextTVPageAttribution } from "../components";
import { favoriter } from "./favoriter";
import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from "@ionic/react";
import { useHistory } from "react-router";
import { SenastUppdaterat } from "../modules/SenastUppdaterat";

function LatestUpdatedPagesxxx(props) {
  const { refreshTime } = props;
  const history = useHistory();

  return (
    <>
      <h2 className="ion-padding-start ion-padding-end ion-text-left ion-no-margin">
        Senaste nyheterna
      </h2>
      <SenastUppdaterat
        {...props}
        history={history}
        refreshTime={refreshTime}
        selectedSegment="news"
        count="5"
      />

      <h2 className="ion-padding-start ion-padding-end ion-text-left ion-no-margin">
        Senaste sportnyheterna
      </h2>
      <SenastUppdaterat
        {...props}
        history={history}
        refreshTime={refreshTime}
        selectedSegment="sports"
        count="5"
      />
    </>
  );
}

/**
 * Innehåll under en texttv-sida för att engagera användaren lite mer.
 *
 * Visas endast på sidor med en enda sida.
 */
function RelatedPageContent(props) {
  const { pageData, pageNum } = props;

  console.log("pageData", pageData);
  console.log("pageNum", pageNum);

  const history = useHistory();

  return (
    <div className="TextTVPage__related" style={{ textAlign: "left" }}>
      <IonList>
        <IonListHeader>
          <IonLabel>Sidor</IonLabel>
        </IonListHeader>

        {favoriter.map((page) => {
          const pages = page.pages;
          const url = page.href ? page.href : `/sidor/${pages}`;

          return (
            <IonItem
              button
              detail
              key={page.title}
              lines="none"
              onClick={(e) => {
                e.preventDefault();
                logPageView(page.isHome ? "home" : pages, "menu_pages");
                history.push(url);
              }}
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
              </IonLabel>
              <IonNote slot="end" className="ListPageNum" color="medium">
                {pages}
              </IonNote>
            </IonItem>
          );
        })}
      </IonList>
    </div>
  );
}

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

      {Array.isArray(pageData) && pageData.length === 1 && (
        <>
          <LatestUpdatedPagesxxx
            pageData={pageData}
            pageNum={pageNum}
            refreshTime={refreshTime}
          />

          <RelatedPageContent pageData={pageData} pageNum={pageNum} />
        </>
      )}
    </>
  );
};

export { TextTVPage };
