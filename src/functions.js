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

export { getPageRangeInfo, getCacheBustTimeString };
