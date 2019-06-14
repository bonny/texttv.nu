import { IonCard } from "@ionic/react";
import fitty from "fitty";
import React, { useEffect, useState } from "react";
// import { FontSubscriber } from "react-with-async-fonts";
import "./TextTVPage.css";
import { SkeletonTextTVPage } from "../SkeletonTextTVPage";

function createMarkupForPage(page) {
  return {
    __html: page.content
  };
}

export default props => {
  const { pageNum, children, button, history, refreshTime } = props;
  const [componentIsUnloaded, setComponentIsUnloaded] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);

  const handleClick = e => {
    e.preventDefault();
    const target = e.target;
    if (target.nodeName === "A") {
      // This is a link.
      // href is '/100', '/101-102', '150,163'
      let href = target.getAttribute("href");

      // Make sure string begins with "/".
      if (!href.startsWith("/")) {
        href = `/${href}`;
      }

      console.log("handle link click", href);
      history.push(`/sida${href}`);
    }
  };

  // Load page from TextTV.nu when pageNum or refreshTime is changed
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
      }, 1000);
    }

    fetchPageContents();

    return () => {
      console.log("texttv page setComponentIsUnloaded");
      setComponentIsUnloaded(true);
    };
  }, [pageNum, refreshTime]);

  // Wrap each page inside a card
  const pagesHtml = pageData.map(page => {
    return (
      <div className="TextTVPage" key={page.id}>
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

return <>{pageIsLoading && <SkeletonTextTVPage />} {pagesHtml}</>;
};
