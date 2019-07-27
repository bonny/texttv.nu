/**
 * En text-tv-sida.
 */
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { createMarkupForPage, getNearestLink } from "../functions";
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

  // const [componentIsCleanUped, setComponentIsCleanUped] = useState(false);
  const [pageData, setPageData] = useState([]);
  //const prevPageData = usePrevious(pageData);
  const prevPageNum = usePrevious(pageNum);

  // const [pageIsLoaded, setPageIsLoaded] = useState(false);
  //const [pageIsLoading, setPageIsLoading] = useState(true);
  const [pageIsLoadingNewPageRange, setPageIsLoadingNewPageRange] = useState(
    true
  );

  // Leta upp närmaste länk, om någon, vid klick nånstans på sidan,
  // och gå till den länken.
  const handleClick = e => {
    e.preventDefault();

    // const target = e.target;
    const link = getNearestLink(e);

    if (link && link.nodeName === "A") {
      // This is a link.
      // href is '/100', '/101-102', '150,163'
      let href = link.getAttribute("href");

      // Make sure string begins with "/".
      if (!href.startsWith("/")) {
        href = `/${href}`;
      }

      // Göm ev synliga toasts.
      document
        .querySelectorAll("ion-toast.TextTVPage_UpdatedToast")
        .forEach(elm => {
          elm.dismiss();
        });

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
      console.log(
        "go to link, history pathname",
        history.location.pathname,
        history.location,
        firstPathName
      );
      history.push(`/${pathPrefix}${href}`);
    } // else {
    // https://franciscohodge.com/2018/01/14/find-closest-element-click-coordinates-javascript-coding-question/
    // https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
    // https://stackoverflow.com/questions/7322490/finding-element-nearest-to-clicked-point
    // console.log("handle page click outside link (find nearest link)", e);
    // getNearestLink(e);
    // }
  };

  // TODO: när ny sida laddas ska vi tömma pagedata då?
  // Om samma sida = behåll data pga vill inte få en sida
  // som blinkar till eller så och sen inte har fått nåt nytt innehåll.
  // Om ny sida: nån effekt.
  // setPageData([]);
  // Använd useLayoutEffect istället för useEffect pga den senare gör att man hinner
  // se det gamla innehållet först.
  useLayoutEffect(() => {
    if (pageNum !== prevPageNum) {
      console.log(
        "texttv-page useEffect when prevPageNum is different from pageNum",
        prevPageNum,
        "->",
        pageNum
      );
      console.log("----- new page range, empty page data before fetch -----");
      setPageData([]);
      setPageIsLoadingNewPageRange(true);
    }
  }, [pageNum, pageId, refreshTime, prevPageNum]);
  /**
   * Ladda in sida från API när pageNum eller refreshTime ändras.
   */
  useEffect(() => {
    console.log("texttv-page useEffect, before fetch", pageNum, refreshTime);

    // setPageIsLoading(true);
    // setPageIsLoaded(false);

    async function fetchPageContents() {
      // Hämta senaste sidan om bara pageNum,
      // hämta arkiv-sida om pageId
      let url;

      // Set to seconds integer to fake a slow answer.
      const slowAnswer = false;
      let slowAnswerQueryString = slowAnswer
        ? `&slow_answer=${slowAnswer}`
        : "";

      // TODO: ?cb= to group cache api requests

      if (pageId) {
        url = `https://api.texttv.nu/api/getid/${pageId}/${pageNum}?app=texttvapp${slowAnswerQueryString}`;
      } else {
        url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp${slowAnswerQueryString}`;
      }

      const response = fetch(url);
      response
        .then(async responseDatas => {
          const pageData = await responseDatas.json();
          // Vänta lite med att sätta ny sidata pga felsökning och test osv.
          // setTimeout(() => {
          // console.log("texttv-page useEffect, after fetch", pageNum, pageId);
          setPageData(pageData);
          //setPageIsLoading(false);
          // setPageIsLoaded(true);
          // }, 1000);
          // console.log(
          //   "texttv-page useEffect, after fetch and set page data done",
          //   pageNum,
          //   pageId
          // );
        })
        .catch(fetchErr => {
          console.log("Fel vid hämtning av sida:", fetchErr);
        });
    }

    fetchPageContents();

    // Cleanup when component is moved out of screen.
    return () => {
      // console.log("texttv page setComponentIsCleanUped", pageNum, pageId);
      // setComponentIsCleanUped(true);
      // console.log(pageNum, "cleanup");
      // setPageData([]);
    };
  }, [pageNum, pageId, refreshTime]);

  useEffect(() => {
    // console.log("useEffect when pageData changes for pageNum", pageNum);
    if (onPageUpdate) {
      // console.log(typeof onPageUpdate);
      onPageUpdate(pageData);
    }
    // Kör funktion från props, om någon.
    // if (memoizedOnPageUpdate) {
    //   memoizedOnPageUpdate({ pageData });
    // }
  }, [pageNum, pageData, onPageUpdate]);

  const classes = classNames({
    "TextTVPage--isLoadingNewPageRange": pageIsLoadingNewPageRange,
    TextTVPage: true
  });

  // console.log("classes", classes);

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
      {/* {pageIsLoading && <SkeletonTextTVPage pageNum={pageNum} />} */}
      {/* <div>{pageNum}</div>
      <div>pageData.length: {pageData.length}</div> */}
      {pagesHtml}
    </>
  );
};
