/**
 * En text-tv-sida.
 */
import React, { useEffect, useState, useRef } from "react";
import { createMarkupForPage, getNearestLink } from "../functions";

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
  const prevPageData = usePrevious(pageData);
  const prevPageNum = usePrevious(pageNum);
  const pageRef = useRef();

  // const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  // Leta upp närmaste länk, om någon, vid klick nånstans på sidan.
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

      // Gå till sida 🎉.
      history.push(`/sidor${href}`);
    } // else {
    // https://franciscohodge.com/2018/01/14/find-closest-element-click-coordinates-javascript-coding-question/
    // https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
    // https://stackoverflow.com/questions/7322490/finding-element-nearest-to-clicked-point
    // console.log("handle page click outside link (find nearest link)", e);
    // getNearestLink(e);
    // }
  };

  /**
   * Ladda in sida från API när pageNum eller refreshTime ändras.
   */
  useEffect(() => {
    console.log("texttv-page useEffect, before fetch", pageNum, refreshTime);
    if (prevPageNum) {
      // console.log("prev pageData", prevPageData[0].num);
      console.log("prev prevPageNum", prevPageNum);
    }

    // TODO: när ny sida laddas ska vi tömma pagedata då?
    // Om samma sida = behåll data pga vill inte få en sida
    // som blinkar till eller så och sen inte har fått nåt nytt innehåll.
    // Om ny sida: nån effekt.
    // setPageData([]);
    if (prevPageNum !== pageNum) {
      console.log("-----------------new page range---------");
      setPageData([]);
    }

    setPageIsLoading(true);
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
          setPageIsLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, pageId, refreshTime]);

  useEffect(() => {
    // console.log("useEffect when pageData changes");
    if (onPageUpdate) {
      // console.log(typeof onPageUpdate);
      onPageUpdate(pageData);
    }
    // Kör funktion från props, om någon.
    // if (memoizedOnPageUpdate) {
    //   memoizedOnPageUpdate({ pageData });
    // }
  }, [pageData, onPageUpdate]);

  // Wrap each page.
  const pagesHtml = pageData.length ? pageData.map(page => {
    return (
      <div
        className="TextTVPage"
        key={page.id}
        data-page-num={pageNum}
        data-page-id={pageId}
        ref={pageRef}
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
  }) : null;

  return (
    <>
      {/* {pageIsLoading && <SkeletonTextTVPage pageNum={pageNum} />} */}
      <div>{pageNum}</div>
      {pagesHtml}
    </>
  );
};
