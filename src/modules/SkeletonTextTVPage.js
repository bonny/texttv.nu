import { IonSkeletonText } from "@ionic/react";
import React from "react";

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

/**
 * Returnerar antalet sidor som pageRange innehåller,
 * dvs om man skickar in 100 så returneras 1,
 * skickar man in 100-102 så får man 3,
 * skickar man in 100-102,103-104 så får man 5.
 *
 * @param mixed pageRange int eller string med sidnummer/sidintervall.
 * @return int Antal sidor som pageRange innehåller
 */
function getPageCount(pageRange) {
  // Sidorna separeras med komma.
  let pageNums = pageRange.split(",");

  // Ta bort mellanslag först och sist i varje element.
  pageNums = pageNums.map(string => string.trim());

  // Räkna ut.
  let pageCount = pageNums.reduce((acc, currentVal) => {
    let numberParts = currentVal.split("-");
    if (numberParts.length === 1) {
      // Bara en enkel siffra, t.ex. "100", så öka med 1.
      acc++;
    } else if (numberParts.length === 2) {
      // Intervall, t.ex. "101-102".
      const intervalCount =
        parseInt(numberParts[1]) - parseInt(numberParts[0]) + 1;
      acc = acc + intervalCount;
    }

    return acc;
  }, 0);

  return pageCount;
}

export function SkeletonTextTVPage(props) {
  const { pageNum } = props;
  // console.log("SkeletonTextTVPage, pageNum", pageNum);
  // console.log("SkeletonTextTVPage, getPageCount", getPageCount(pageNum));
  const pageCount = getPageCount(pageNum);

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
