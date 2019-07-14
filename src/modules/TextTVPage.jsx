/**
 * En text-tv-sida.
 */
import React, { useEffect, useState } from "react";
import { SkeletonTextTVPage } from "./SkeletonTextTVPage";
// import { close, refresh } from "ionicons/icons";
// import { FontSubscriber } from "react-with-async-fonts";

// const debug = false;

function createMarkupForPage(page) {
  return {
    __html: page.content
  };
}

function isValidHit(el) {
  // console.log("isValidHit", el.nodeName);
  //return el && el.webkitMatchesSelector("aside");
  return el && el.nodeName === "A";
}

// function drawDot(parent, x, y) {
//   // console.log(parent, x, y);
//   var dot = document.createElement("b");
//   dot.setAttribute("style", "top: " + y + "px; left: " + x + "px;");
//   //    dot.style.top = y + 'px';
//   //    dot.style.left = x + 'px';
//   parent.appendChild(dot);
// }

function hitTest(x, y) {
  var element,
    hit = document.elementFromPoint(x, y);

  if (isValidHit(hit)) {
    element = hit;
  }

  var i = 0;

  // if (debug) {
  //   var dotParent = document.createElement("div");
  //   dotParent.classList.add("dot-container");
  // }

  while (!element) {
    i = i + 3;

    if (i > 40) {
      // console.log("seat belt!");
      break;
    }

    var increment = i / Math.sqrt(2);
    // increment = i;
    var points = [
      [x - increment, y - increment],
      [x + increment, y - increment],
      [x + increment, y + increment],
      [x - increment, y + increment]
    ];

    // Threshold until we start testing for direct horizontal and vertical coordinates.
    if (i > 5) {
      points.push([x, y - i], [x + i, y], [x, y + i], [x - i, y]);
    }

    // Threshold until we start testing for direct horizontal and vertical coordinates.
    if (i > 10) {
      increment = Math.floor(i / (2 * Math.sqrt(2)));
      points.push(
        [x - i, y - increment],
        [x - increment, y - i],
        [x + increment, y - i],
        [x + i, y - increment],
        [x + i, y + increment],
        [x + increment, y + i],
        [x - increment, y + i],
        [x - i, y + increment]
      );
    }

    var foundPoints = points.find(pointsSome);
    if (foundPoints) {
      // console.log("foundPoints", foundPoints);
      element = document.elementFromPoint.apply(document, foundPoints);
    }

    // if (elem) {
    //   element = hit;
    // }
  }

  // if (debug) {
  //   var section = document.querySelector("ion-app");
  //   if (dotParent && section) section.appendChild(dotParent);
  // }

  return element;
}

const pointsSome = function(coordinates) {
  var hit = document.elementFromPoint.apply(document, coordinates);
  // if (debug) {
  //   drawDot(dotParent, coordinates[0], coordinates[1]);
  // }
  if (isValidHit(hit)) {
    //element = hit;
    // console.log("valid hit", hit);

    return hit;
  }

  return false;
};

const getNearestLink = e => {
  // console.log("getNearestLink");
  // console.log("clientXY", e.clientX, e.clientY);
  // console.log("pageXY", e.pageX, e.pageY);
  const nearestLink = hitTest(e.clientX, e.clientY);
  //console.log("nearestLink", nearestLink);
  return nearestLink;
};

export default props => {
  const { pageNum, pageId, children, history, refreshTime } = props;

  // const [componentIsCleanUped, setComponentIsCleanUped] = useState(false);
  const [pageData, setPageData] = useState([]);
  
  // const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);

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

      // console.log("handle link click", href);
      history.push(`/sidor${href}`);
    } // else {
    // https://franciscohodge.com/2018/01/14/find-closest-element-click-coordinates-javascript-coding-question/
    // https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
    // https://stackoverflow.com/questions/7322490/finding-element-nearest-to-clicked-point
    // console.log("handle page click outside link (find nearest link)", e);
    // getNearestLink(e);
    // }
  };

  // Load page from TextTV.nu when pageNum or refreshTime is changed
  useEffect(() => {
    // console.log("texttv-page useEffect, before fetch", pageNum, pageId);
    // console.log("isComponentCleaned", componentIsCleanUped);

    setPageData([]);
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

      if (pageId) {
        url = `https://api.texttv.nu/api/getid/${pageId}/${pageNum}?app=texttvapp${slowAnswerQueryString}`;
      } else {
        url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp${slowAnswerQueryString}`;
      }

      const response = await fetch(url);
      const pageData = await response.json();

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

  // Wrap each page.
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

  return (
    <>
      {pageIsLoading && <SkeletonTextTVPage pageNum={pageNum} />} {pagesHtml}
    </>
  );
};
