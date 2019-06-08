import { IonButton, IonCard } from "@ionic/react";
import React, { useEffect, useState } from "react";
import fitty from "fitty";
import "./texttv-page.css";
import { FontSubscriber } from "react-with-async-fonts";

export const TextTvPage = props => {
  const { pageNum, children } = props;
  const [fontIsLoaded, setFontIsLoaded] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // https://github.com/rikschennink/fitty
    if (fontIsLoaded) {
      console.log("run fitty because font is loaded", pageNum, fontIsLoaded);
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
    setPageIsLoaded(false);
    setPageIsLoading(true);

    async function fetchPageContents() {
      const url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp`;
      const response = await fetch(url);
      const pageData = await response.json();
      // console.log("pageData", pageData);
      setPageData(pageData);
      setPageIsLoaded(true);
      setPageIsLoading(false);
    }

    fetchPageContents();
  }, [pageNum]);

  function createMarkupForPage(page) {
    return {
      __html: page.content
    };
  }

  // Wrap each page inside a card
  const html = pageData.map(page => {
    return (
      <IonCard key={page.id}>
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

  return (
    <FontSubscriber>
      {fonts => {
        // console.log("fonts", fonts);
        if (fonts.ubuntuMono) {
          setFontIsLoaded(true);
        }

        return (
          <>
            {/* <IonCard {...props} onClick={props.onCardClick}> */}
            {html}
            {/* </IonCard> */}
          </>
        );
      }}
    </FontSubscriber>
  );
};
