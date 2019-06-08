import { IonCard, IonSkeletonText } from "@ionic/react";
import fitty from "fitty";
import React, { useEffect, useState } from "react";
import { FontSubscriber } from "react-with-async-fonts";
import "./texttv-page.css";

export const TextTvPage = props => {
  const { pageNum, children, button } = props;
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

      setPageData(pageData);
      setPageIsLoading(false);
      setPageIsLoaded(true);
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

  const skeletonWrapStyle = {
    backgroundColor: "rgb(17, 30, 63)",
    padding: "14px"
  };

  const getRandomWidth = (min = 85, max = 100) => {
    const width = Math.random() * (max - min) + min + "%";
    return width;
  };

  const SkeletonRow = () => {
    const width = getRandomWidth();
    const skeletonStyle = {
      height: "16px",
      backgroundColor: "rgba(100,100,100,.5)",
      width: width
    };

    return <IonSkeletonText animated style={skeletonStyle} />;
  };

  const SkeletonItems = [...Array(10)].map((val, index) => {
    return <SkeletonRow key={index} />;
  });

  const style = {
    backgroundColor: "rgba(100,100,100,.5)",
    height: "16px"
  };

  const skeletonPage = (
    <>
      <IonCard>
        <div style={skeletonWrapStyle}>
          <IonSkeletonText animated style={style} />
          <IonSkeletonText animated style={style} />
          <IonSkeletonText animated />
          {SkeletonItems}
          <IonSkeletonText animated />
          <IonSkeletonText animated style={style} />
        </div>
      </IonCard>
    </>
  );

  return (
    <FontSubscriber>
      {fonts => {
        if (fonts.ubuntuMono) {
          setFontIsLoaded(true);
        }

        return (
          <>
            {pageIsLoading && skeletonPage}
            {html}
          </>
        );
      }}
    </FontSubscriber>
  );
};
