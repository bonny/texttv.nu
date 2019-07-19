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
    cacheBusterTime.getUTCDay() +
    "-" +
    cacheBusterTime.getUTCDate() +
    "_" +
    cacheBusterTime.getUTCHours() +
    ":" +
    cacheBusterTime.getUTCMinutes();

  var seconds = cacheBusterTime.getUTCSeconds();

  seconds = seconds - (seconds % secondsInterval);
  cacheBusterString += cacheBusterString + ":" + seconds;

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
 */
function getCurrentIonPageContent() {
  const currentIonPageContent = [
    ...document.querySelectorAll(
      ".ion-page#main .ion-page:not(.ion-page-hidden) ion-content"
    )
  ].find(e => true);

  return currentIonPageContent;
}

/**
 * Hämta och sätt ion page content och dess scroll element.
 * Behövs bara göras vid mount.
 */
function getAndSetIonPageContentAndIonPageScrollElement(
  setIonPageContent,
  setIonPageScrollElement
) {
  const currentIonPageContent = getCurrentIonPageContent();
  if (currentIonPageContent) {
    setIonPageContent(currentIonPageContent);
    currentIonPageContent.getScrollElement().then(elm => {
      setIonPageScrollElement(elm);
    });
  }
}

export {
  getPageRangeInfo,
  getCacheBustTimeString,
  getUnixtime,
  getCurrentIonPage,
  getCurrentIonPageContent,
  getAndSetIonPageContentAndIonPageScrollElement
};
