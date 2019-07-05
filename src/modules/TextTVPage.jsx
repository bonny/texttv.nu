import React, { useEffect, useState } from "react";
import { SkeletonTextTVPage } from "../SkeletonTextTVPage";
// import { FontSubscriber } from "react-with-async-fonts";

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
  // var dotParent = document.createElement("div");
  // dotParent.classList.add("dot-container");
  while (!element) {
    i = i + 7;

    if (i > 40) {
      console.log("seat belt!");
      break;
    }

    var increment = i / Math.sqrt(2);
    var points = [
      [x - increment, y - increment],
      [x + increment, y - increment],
      [x + increment, y + increment],
      [x - increment, y + increment]
    ];

    // Threshold until we start testing for direct horizontal and vertical coordinates.
    if (i > 40) {
      points.push([x, y - i], [x + i, y], [x, y + i], [x - i, y]);
    }

    // Threshold until we start testing for direct horizontal and vertical coordinates.
    if (i > 100) {
      var increment = Math.floor(i / (2 * Math.sqrt(2)));
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

    points.some(function(coordinates) {
      var hit = document.elementFromPoint.apply(document, coordinates);
      // drawDot(dotParent, coordinates[0], coordinates[1]);
      if (isValidHit(hit)) {
        element = hit;
        return true;
      }
    });
  }

  // var section = document.querySelector("ion-app");
  // if (dotParent && section) section.appendChild(dotParent);

  return element;
}

const getNearestLink = e => {
  console.log("getNearestLink");
  console.log("clientXY", e.clientX, e.clientY);
  // console.log("pageXY", e.pageX, e.pageY);
  const nearestLink = hitTest(e.clientX, e.clientY);
  //console.log("nearestLink", nearestLink);
  return nearestLink;
};

export default props => {
  const { pageNum, pageId, children, history, refreshTime } = props;

  // const [componentIsUnloaded, setComponentIsUnloaded] = useState(false);
  const [pageData, setPageData] = useState([]);
  // const [pageIsLoaded, setPageIsLoaded] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);

  const handleClick = e => {
    e.preventDefault();

    const target = e.target;
    const link = getNearestLink(e);
    //console.log('link', link);
    //return;

    if (link.nodeName === "A") {
      // This is a link.
      // href is '/100', '/101-102', '150,163'
      let href = link.getAttribute("href");

      // Make sure string begins with "/".
      if (!href.startsWith("/")) {
        href = `/${href}`;
      }

      console.log("handle link click", href);
      history.push(`/sida${href}`);
    } else {
      // https://franciscohodge.com/2018/01/14/find-closest-element-click-coordinates-javascript-coding-question/
      // https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint
      // https://stackoverflow.com/questions/7322490/finding-element-nearest-to-clicked-point
      // console.log("handle page click outside link (find nearest link)", e);
      // getNearestLink(e);
    }
  };

  // Load page from TextTV.nu when pageNum or refreshTime is changed
  useEffect(() => {
    console.log("texttv-page useEffect");

    setPageData([]);
    setPageIsLoading(true);
    // setPageIsLoaded(false);

    async function fetchPageContents() {
      // Hämta senaste sidan om bara pageNum,
      // hämta arkiv-sida om pageId
      let url;

      if (pageId) {
        url = `https://api.texttv.nu/api/getid/${pageId}/${pageNum}?app=texttvapp`;
      } else {
        url = `https://api.texttv.nu/api/get/${pageNum}?app=texttvapp`;
      }

      const response = await fetch(url);
      const pageData = await response.json();

      // Vänta lite med att sätta ny sidata pga felsökning och test osv.
      // setTimeout(() => {
      setPageData(pageData);
      setPageIsLoading(false);
      // setPageIsLoaded(true);
      // }, 1000);
    }

    fetchPageContents();

    return () => {
      console.log("texttv page setComponentIsUnloaded", pageNum, pageId);
      // setComponentIsUnloaded(true);
    };
  }, [pageNum, pageId, refreshTime]);

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

  return (
    <>
      {pageIsLoading && <SkeletonTextTVPage />} {pagesHtml}
    </>
  );
};
