import { IonCard } from "@ionic/react";
import fitty from "fitty";
import React, { useEffect, useState } from "react";
import { FontSubscriber } from "react-with-async-fonts";
import "./texttv-page.css";
import { SkeletonTextTVPage } from "./SkeletonTextTVPage";

export const TextTvPage = props => {
  const { pageNum, children, button } = props;
  const [componentIsUnloaded, setComponentIsUnloaded] = useState(false);
  const [fontIsLoaded, setFontIsLoaded] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // https://github.com/rikschennink/fitty
    if (fontIsLoaded && pageIsLoaded) {
      console.log(
        "run fitty because font and page is loaded",
        pageNum,
        fontIsLoaded
      );
      fitty(".TextTVPage__inner", {
        minSize: 2,
        maxSize: 18
      });

      // setTimeout(() => {
      //   console.log("fitty.fitAll()	");
      //   fitty.fitAll();
      // }, 1500);
    }
  }, [pageNum, fontIsLoaded, pageIsLoaded]);

  // Load page from TextTV.nu
  useEffect(() => {
    setPageIsLoading(true);
    setPageIsLoaded(false);
    setPageData([]);

    async function fetchPageContents() {
      const url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp`;
      const response = await fetch(url);
      const pageData = await response.json();

      // Vänta lite med att sätta ny sidata pga felsökning och test osv.
      setTimeout(() => {
        setPageData(pageData);
        setPageIsLoading(false);
        setPageIsLoaded(true);
      }, 3000);
    }

    fetchPageContents();

    return () => {
      console.log("setComponentIsUnloaded");
      setComponentIsUnloaded(true);
    };
  }, [pageNum]);

  function createMarkupForPage(page) {
    return {
      __html: page.content
    };
  }

  // Wrap each page inside a card
  const html = pageData.map(page => {
    return (
      <IonCard key={page.id} button={button}>
        <div className="TextTVPage">
          <div className="TextTVPage__wrap">
            <div
              className="TextTVPage__inner"
              dangerouslySetInnerHTML={createMarkupForPage(page)}
            />
          </div>
        </div>
        {children}
      </IonCard>
    );
  });

  console.log("page html", pageNum, html);

  return (
    <>
      {pageIsLoading && <SkeletonTextTVPage />}
      {pageIsLoaded && html}
    </>
  );
};

