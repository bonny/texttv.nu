import { IonCard } from "@ionic/react";
import fitty from "fitty";
import React, { useEffect, useState } from "react";
// import { FontSubscriber } from "react-with-async-fonts";
import "./texttv-page.css";
import { SkeletonTextTVPage } from "./SkeletonTextTVPage";

function createMarkupForPage(page) {
  return {
    __html: page.content
  };
}

export const TextTvPage = props => {
  const { pageNum, children, button, history } = props;
  const [componentIsUnloaded, setComponentIsUnloaded] = useState(false);
  const [fontIsLoaded, setFontIsLoaded] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const refreshTime = Math.floor(Date.now() / 1000);

  // useEffect(() => {
  //   // https://github.com/rikschennink/fitty
  //   if (fontIsLoaded && pageIsLoaded) {
  //     console.log(
  //       "run fitty because font and page is loaded",
  //       pageNum,
  //       fontIsLoaded
  //     );
  //     fitty(".TextTVPage__inner", {
  //       minSize: 2,
  //       maxSize: 18
  //     });

  //     // setTimeout(() => {
  //     //   console.log("fitty.fitAll()	");
  //     //   fitty.fitAll();
  //     // }, 1500);
  //   }
  // }, [pageNum, fontIsLoaded, pageIsLoaded]);

  const handleClick = e => {
    e.preventDefault();
    const target = e.target;
    if (target.nodeName === "A") {
      // This is a link.
      // href is '/100', '/101-102', etc.
      const href = target.getAttribute("href");
      console.log("handle link click", href);
      history.push(`/sida${href}`);
    }
  };

  // Load page from TextTV.nu when pageNum is changed

  useEffect(() => {
    console.log("texttv-page useEffect");

    setPageData([]);
    setPageIsLoading(true);
    setPageIsLoaded(false);

    async function fetchPageContents() {
      const url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp`;
      const response = await fetch(url);
      const pageData = await response.json();

      // Vänta lite med att sätta ny sidata pga felsökning och test osv.
      setTimeout(() => {
        setPageData(pageData);
        setPageIsLoading(false);
        setPageIsLoaded(true);
      }, 2000);
    }

    fetchPageContents();

    return () => {
      console.log("texttv page setComponentIsUnloaded");
      setComponentIsUnloaded(true);
    };
  }, [pageNum]);

  // Wrap each page inside a card
  const pagesHtml = pageData.map(page => {
    return (
      <>
        {/* <IonCard key={page.id} button={button}> */}
        <div className="TextTVPage" key={page.id}>
          <div className="TextTVPage__wrap">
            <div
              className="TextTVPage__inner"
              onClick={handleClick}
              dangerouslySetInnerHTML={createMarkupForPage(page)}
            />
          </div>
        </div>
        {children}
        {/* </IonCard> */}
      </>
    );
  });

  // console.log("page html", pageNum, html);

  return (
    <>
      {pageIsLoading ? <SkeletonTextTVPage /> : pagesHtml}
      <p>
        Refresh time: {refreshTime}, page: {pageNum}
      </p>
    </>
  );
};
