/**
 * Hjälpare.
 */

/**
 * Returnerar information om en pangeRange:
 * - antalet sidor som pageRange innehåller
 * - om det är en giltig pagerange
 *
 * dvs om man skickar in 100 så returneras 1,
 * skickar man in 100-102 så får man 3,
 * skickar man in 100-102,103-104 så får man 5.
 *
 * @param mixed pageRange int eller string med sidnummer/sidintervall.
 * @return int Antal sidor som pageRange innehåller
 */
function getPageRangeInfo(pageRange) {
  // Objekt som innehåller resultet av testerna.
  let pageRangeInfo = {
    isValid: false,
    allValid: true,
    count: 0,
    ranges: []
  };

  // Sidorna separeras med komma.
  let pageNums = pageRange.split(",");

  // Ta bort mellanslag först och sist i varje element.
  pageNums = pageNums.map(string => string.trim());

  // Räkna ut.
  pageNums.reduce((acc, currentVal) => {
    let numberParts = currentVal.split("-");
    if (numberParts.length === 1) {
      // Bara en enkel siffra, t.ex. "100", så öka med 1.
      let maybeNumber = numberParts[0];
      let isNumber = !isNaN(maybeNumber);
      if (isNumber) {
        maybeNumber = parseInt(maybeNumber);
        pageRangeInfo.isValid = true;
        pageRangeInfo.count++;
        pageRangeInfo.ranges.push(maybeNumber);
      } else {
        pageRangeInfo.allValid = false;
      }
    } else if (numberParts.length === 2) {
      // Intervall, t.ex. "101-102".
      let maybeFirstNumber = parseInt(numberParts[0]);
      let maybeSecondNumber = parseInt(numberParts[1]);
      if (!isNaN(maybeFirstNumber) && !isNaN(maybeSecondNumber)) {
        let intervalCount = maybeSecondNumber - maybeFirstNumber + 1;
        pageRangeInfo.isValid = true;
        pageRangeInfo.count = pageRangeInfo.count + intervalCount;
        pageRangeInfo.ranges.push(`${maybeFirstNumber}-${maybeSecondNumber}`);
      } else {
        pageRangeInfo.allValid = false;
      }
    } else {
      pageRangeInfo.allValid = false;
    }

    return acc;
  }, 0);

  return pageRangeInfo;
}

function getCacheBustTimeString(secondsInterval = 15) {
  var cacheBusterTime = new Date();

  var cacheBusterString =
    cacheBusterTime.getUTCFullYear() +
    "-" +
    (cacheBusterTime.getUTCDay() + 1) +
    "-" +
    cacheBusterTime.getUTCDate() +
    "_" +
    cacheBusterTime.getUTCHours() +
    ":" +
    cacheBusterTime.getUTCMinutes();

  var seconds = cacheBusterTime.getUTCSeconds();

  seconds = seconds - (seconds % secondsInterval);
  cacheBusterString += ":" + seconds;

  return cacheBusterString;
}

/**
 * Hämta unixtid, dvs antal sekunder sedan
 * Jan 01 1970.
 
 * @return int Antal sekunder
 */
function getUnixtime() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Hämta aktuella sidan, dvs den .ion-page som inte är dold.
 *
 * @return Element
 */
function getCurrentIonPage() {
  const currentIonPage = [
    ...document.querySelectorAll(
      ".ion-page#main .ion-page:not(.ion-page-hidden)"
    )
  ].find(e => true);
  return currentIonPage;
}

/**
 * Hämtar den aktuella sidan IonPageContent-elment,
 * dvs elementet man kan scrolla som innehåller innehållet.
 * Finns inte elementet eller om det inte ä redo (hydrated)
 * så retuneras false.
 */
function getCurrentIonPageContentElm() {
  const currentIonPageContent = [
    ...document.querySelectorAll(
      "#mainContent .ion-page:not(.ion-page-hidden) ion-content"
    )
  ].find(e => true);

  // Baila om inget element alls hittades.
  if (!currentIonPageContent) {
    return false;
  }

  // BAila om elementet inte är redo.
  if (
    currentIonPageContent &&
    !currentIonPageContent.classList.contains("hydrated")
  ) {
    return false;
  }

  return currentIonPageContent;
}

/**
 * Hämta element som är elementet som scrollar.
 */
function getCurrentIonPageScrollElm() {
  const pageElm = getCurrentIonPageContentElm();
  if (!pageElm || !pageElm.shadowRoot) {
    return false;
  }
  const scrollElm = pageElm.shadowRoot.querySelector(".inner-scroll");
  return scrollElm;
}

/**
 * Hämta och sätt ion page content och dess scroll element.
 */
function getAndSetIonPageContentAndIonPageScrollElement(
  setIonPageContent,
  setIonPageScrollElement
) {
  const currentIonPageContent = getCurrentIonPageContentElm();
  if (currentIonPageContent) {
    setIonPageContent(currentIonPageContent);

    const scrollElm = getCurrentIonPageScrollElm();
    setIonPageScrollElement(scrollElm);
  }
}

/**
 * Ta bort taggar från html.
 * Funktion från
 * https://ourcodeworld.com/articles/read/376/how-to-strip-html-from-a-string-extract-only-text-content-in-javascript
 *
 * @param string html
 * @return string Strängen som ren text
 */

function stripHtml(html) {
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

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

/**
 * Function from
 * https://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
 */
const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

/**
 * Gömmer eventuella synliga toasts gällande siduppdateringar.
 */
function hidePageUpdatedToasts() {
  document
    .querySelectorAll("ion-toast.TextTVPage_UpdatedToast")
    .forEach(elm => {
      elm.dismiss();
    });
}

export {
  getPageRangeInfo,
  getCacheBustTimeString,
  getUnixtime,
  getCurrentIonPage,
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm,
  getAndSetIonPageContentAndIonPageScrollElement,
  stripHtml,
  pointsSome,
  getNearestLink,
  isValidHit,
  hitTest,
  createMarkupForPage,
  normalizeBetweenTwoRanges,
  hidePageUpdatedToasts
};
