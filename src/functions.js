/**
 * Hjälpare.
 */
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";
import { Preferences } from "@capacitor/preferences";
import { isPlatform } from "@ionic/react";
import { FirebaseAnalytics } from "./analytics";
// import { RateApp } from "capacitor-rate-app";

const FAVORITES_DEFAULT_PAGES = ["100", "300", "401", "700"];

const handleCopyTextToClipboard = (pageData, pageNum) => {
  const pageRangeInfo = getPageRangeInfo(pageNum);
  const pageIdsString = getPageIdsFromPageData(pageData);

  let text = "";
  if (pageRangeInfo.count > 1) {
    text = text + `Text TV sidorna ${pageNum}.`;
  } else {
    text = text + `Text TV sidan ${pageNum}.`;
  }

  text = text + "\nDelat via https://texttv.nu.\n";

  pageData.forEach((page, idx) => {
    // Lägg till separator mellan sidor.
    //if (idx > 0) {
    text = text + "\n----------------------------------------\n\n";
    //}

    page.content.forEach((val) => {
      text = text + val;
    });
  });

  text = stripHtml(text);

  Clipboard.write({
    string: text,
  });

  sendStats(pageData, "copyTextToClipboard");

  try {
    FirebaseAnalytics.logEvent({
      name: "share",
      params: {
        content_type: "text to clipboard",
        item_id: pageIdsString,
        page_nums: pageNum,
      },
    });
  } catch (e) {}
};

const handleCopyLinkToClipboard = (pageData, pageNum) => {
  const pageIdsString = getPageIdsFromPageData(pageData);

  const shareDate = new Date();
  const formattedDate = `${shareDate.getFullYear()}-${
    shareDate.getMonth() + 1
  }-${shareDate.getDate()}`;

  const permalink = `https://texttv.nu/${pageNum}/arkiv/${formattedDate}/${pageIdsString}/`;

  Clipboard.write({
    string: permalink,
  });

  sendStats(pageData, "copyLinkToClipboard");

  try {
    FirebaseAnalytics.logEvent({
      name: "share",
      params: {
        content_type: "link to clipboard",
        item_id: pageIdsString,
        page_nums: pageNum,
      },
    });
  } catch (e) {}
};

const handleOpenLinkInBrowser = (pageData, pageNum) => {
  const pageIdsString = getPageIdsFromPageData(pageData);

  const permalink = `https://www.texttv.nu/${pageNum}/arkiv/sida/${pageIdsString}`;
  window.open(permalink);

  sendStats(pageData, "openLinkInBrowser");

  try {
    FirebaseAnalytics.logEvent({
      name: "share",
      params: {
        content_type: "link to browser",
        item_id: pageIdsString,
        page_nums: pageNum,
      },
    });
  } catch (e) {}
};

/**
 * Dela sida mha enhetens egna dela-funktion.
 */
const handleShare = async (e, pageData, pageNum) => {
  const pageIdsString = getPageIdsFromPageData(pageData);
  const permalink = `https://www.texttv.nu/${pageNum}/arkiv/sida/${pageIdsString}`;

  // Titel + ev. text från första sidan.
  const firstPage = pageData[0];

  const sharePromise = Share.share({
    title: `Text TV ${firstPage.num}: ${firstPage.title}`,
    text: `${firstPage.title}
Delad via https://texttv.nu/
`,
    url: permalink,
    dialogTitle: "Dela sida",
  });

  sharePromise
    .then((data) => {
      sendStats(pageData, "share");

      try {
        FirebaseAnalytics.logEvent({
          name: "share",
          params: {
            content_type: "native share",
            item_id: pageIdsString,
            page_nums: pageNum,
          },
        });
      } catch (e) {}
    })
    .catch((err) => {
      console.log("Delning gick fel pga orsak", err);
    });
};

/**
 * Pinga texttv.nu:s api med info
 * om att en sida har tittats på eller delats
 * eller liknande. Används för att skapa sidor
 * med mest de mest lästa sidorna.
 *
 * @param {string} mixed pageIds Kommaseparerad lista med sididn eller array med pagedata att skapa sträng från.
 */
function sendStats(pageIDsOrPageData, type) {
  let pageIdsString = "";
  if (typeof pageIDsOrPageData === "string") {
    pageIdsString = pageIDsOrPageData;
  } else if (typeof pageIDsOrPageData === "object") {
    pageIdsString = getPageIdsFromPageData(pageIDsOrPageData);
  }

  const randomNumber = Math.random();
  const url = `https://api.texttv.nu/api/page/${pageIdsString}/${type}?random=${randomNumber}`;
  fetch(url);
}

/**
 * Gör en kommaseparerad sträng med alla sid-ids.
 *
 * @param {object} pageData.
 * @return {string} Kommaseparerad lista.
 */
function getPageIdsFromPageData(pageData) {
  let pageIdsString = "";

  pageData.forEach((page) => {
    pageIdsString = pageIdsString + `,${page.id}`;
  });

  pageIdsString = pageIdsString.replace(/^,/, "");

  return pageIdsString;
}

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
    ranges: [],
  };

  // pageRange måste vara sträng.
  if (typeof pageRange !== "string") {
    pageRange = "";
  }

  // Sidorna separeras med komma.
  let pageNums = pageRange.split(",");

  // Ta bort mellanslag först och sist i varje element.
  pageNums = pageNums.map((string) => string.trim());

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
    ),
  ].find((e) => true);
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
    ),
  ].find((e) => true);

  // Baila om inget element alls hittades.
  if (!currentIonPageContent) {
    return false;
  }

  // Baila om elementet inte är redo.
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
    __html: page.content,
  };
}

function isValidHit(el) {
  return el && el.nodeName === "A";
}

function hitTest(x, y) {
  var element,
    hit = document.elementFromPoint(x, y);

  if (isValidHit(hit)) {
    element = hit;
  }

  var i = 0;

  while (!element) {
    i = i + 3;

    if (i > 40) {
      break;
    }

    var increment = i / Math.sqrt(2);
    // increment = i;
    var points = [
      [x - increment, y - increment],
      [x + increment, y - increment],
      [x + increment, y + increment],
      [x - increment, y + increment],
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
      element = document.elementFromPoint.apply(document, foundPoints);
    }
  }

  return element;
}

const pointsSome = function (coordinates) {
  var hit = document.elementFromPoint.apply(document, coordinates);

  if (isValidHit(hit)) {
    return hit;
  }

  return false;
};

const getNearestLink = (e) => {
  const nearestLink = hitTest(e.clientX, e.clientY);
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
    .forEach((elm) => {
      elm.dismiss();
    });
}

/**
 * @async
 * @return {Promise<array>} Favoriter som array.
 */
async function loadFavorites() {
  let favs;
  const ret = await Preferences.get({ key: "favorites" });

  try {
    favs = JSON.parse(ret.value);
  } catch (e) {
    // Parse error.
  }

  // Sätt till default-favoriter om man saknar favoriter (eller om något gått fel vid laddning).
  if (favs === null || favs === undefined || favs.length === 0) {
    favs = FAVORITES_DEFAULT_PAGES;
  }

  return favs;
}

async function saveFavorites(favs) {
  await Preferences.set({
    key: "favorites",
    value: JSON.stringify(favs),
  });
}

// Avgör höjd på flikarna/tabbarn, dvs. hur många pixlar ska
// annonsen flyttas upp för att inte vara iväg för flikarna.
function getTabHeight() {
  let tabHeight;

  if (isPlatform("android")) {
    // On Android the tab height is 50px.
    tabHeight = 56;
  } else if (isPlatform("ios")) {
    // On IOS the tab height is 56 px.
    tabHeight = 50;
  } else {
    // Fall tillbaka på 50.
    tabHeight = 50;
  }

  return tabHeight;
}

/**
 * Logga en sidvisning.
 *
 * @param pageNum
 * @param type Varifrån sidvisningen kommer,
 * t.ex. "manually" om man angivit den manuellt i sökruta/inputruta.
 */
function logPageView(pageNum, source) {
  // @TODO: första visningen av en sida loggas inte, t.ex. när app startas
  // console.log('logPageView', pageNum, source)
  if (!pageNum || !source) {
    return;
  }

  increaseStatForPage(pageNum);

  try {
    FirebaseAnalytics.logEvent({
      name: "go_to_page",
      params: {
        source: source,
        page_num: pageNum,
      },
    });
  } catch (e) {}
}

/**
 * Hämta object med statistik.
 *
 * @returns {object}
 */
async function getStats() {
  let { value } = await Preferences.get({
    key: "stats",
  });

  if (value) {
    value = JSON.parse(value);
  } else {
    value = {};
  }

  // Se till att .pages och .custom finns.
  if (!("pages" in value)) {
    value.pages = {};
  }

  if (!("custom" in value)) {
    value.custom = {};
  }

  return value;
}

/**
 * Öka stats för ett sidnummer.
 *
 * @param {number} customKey
 * @returns {number} Nytt antal i db
 */
async function increaseStatForPage(pageNum) {
  let stats = await getStats();

  if (!(pageNum in stats.pages)) {
    stats.pages[pageNum] = 0;
  }

  stats.pages[pageNum] = stats.pages[pageNum] + 1;

  saveStats(stats);

  return stats.pages[pageNum];
}

/**
 * Öka stats för valfritt värde/nyckel.
 *
 * @param {string} customKey
 * @returns {number}
 */
async function increaseStatForCustom(customKey) {
  let stats = await getStats();
  console.log("stats", stats);
  if (!(customKey in stats.custom)) {
    stats.custom[customKey] = 0;
  }

  stats.custom[customKey] = stats.custom[customKey] + 1;

  saveStats(stats);

  // Om man använt appen rätt ofta så fråga om review.
  const numAppStartsAndResumes =
    (stats.custom.appStart || 0) + (stats.custom.appResume || 0);
  const askForReviewNums = [10, 20, 30, 50, 100, 200, 500, 1000, 2000];
  console.log("numAppStartsAndResumes", numAppStartsAndResumes);
  if (askForReviewNums.includes(numAppStartsAndResumes)) {
    console.log(
      "ask for review because numAppStartsAndResumes is ",
      numAppStartsAndResumes
    );
    // RateApp.requestReview();
  }

  return stats.custom[customKey];
}

/**
 * Spara stats.
 *
 * @param {object} statsObj
 */
async function saveStats(statsObj) {
  await Preferences.set({
    key: "stats",
    value: JSON.stringify(statsObj),
  });
}

// window.getStats = getStats;
// async function testStats() {
//   const statsForPage100 = await increaseStatForPage(100);
//   const statsForPage377 = await increaseStatForPage(377);
//   const statsForCustomStart = await increaseStatForCustom("appStart");
//   const statsForCustomResume = await increaseStatForCustom("appResume");
//   console.table({
//     statsForPage100,
//     statsForPage377,
//     statsForCustomStart,
//     statsForCustomResume,
//   });
// }
// testStats();

export {
  getStats,
  increaseStatForPage,
  increaseStatForCustom,
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
  hidePageUpdatedToasts,
  sendStats,
  getPageIdsFromPageData,
  handleCopyLinkToClipboard,
  handleCopyTextToClipboard,
  handleOpenLinkInBrowser,
  handleShare,
  loadFavorites,
  saveFavorites,
  FAVORITES_DEFAULT_PAGES,
  getTabHeight,
  logPageView,
};
