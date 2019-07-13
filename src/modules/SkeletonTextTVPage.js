import { IonSkeletonText } from "@ionic/react";
import React from "react";
import { getPageRangeInfo } from "../functions";

let fortyChars = " ".repeat(40);

let html = `<span class="toprow">${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
`;

export function SkeletonTextTVPage(props) {
  const { pageNum } = props;
  const pageRangeInfo = getPageRangeInfo(pageNum);
  const pageCount = pageRangeInfo.count;

  const skeletonTextStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgb(17,30,63)",
    opacity: 0.75,
    maxWidth: "20em",
    margin: "0 auto"
  };

  // Skapa lika många skeleton-sidor som antalet sidor som ska hämtas och skrivas ut.
  const skeletonPages = [...Array(pageCount)].map((e, i) => {
    return (
      <div className="TextTVPage TextTVPage--skeleton" key={i}>
        <div className="TextTVPage__wrap">
          <div className="TextTVPage__inner">
            <IonSkeletonText animated style={skeletonTextStyle} />
            <div className="root" dangerouslySetInnerHTML={createMarkup()} />
          </div>
        </div>
      </div>
    );
  });

  function createMarkup() {
    return {
      __html: html
    };
  }

  return skeletonPages;
}
