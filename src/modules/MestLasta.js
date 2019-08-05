import { IonList } from "@ionic/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import PagesListing from "./PagesListing";
import SkeletonList from "./SkeletonList";

const MestLastaLista = props => {
  {
    const { history, day = "today", refreshTime, count = 15 } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [pages, setPages] = useState([]);

    // Fetch content for segment when segment day is changed.
    useEffect(() => {
      let isUnmounted = false;
      let dateYMD;
      let todayYMD = dayjs().format("YYYY-MM-DD");
      let yesterdayYMD = dayjs()
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      let dayBeforeYesterdayYMD = dayjs()
        .subtract(2, "day")
        .format("YYYY-MM-DD");

      switch (day) {
        case "dayBeforeYesterday":
          dateYMD = dayBeforeYesterdayYMD;
          break;
        case "yesterday":
          dateYMD = yesterdayYMD;
          break;
        case "today":
        default:
          dateYMD = todayYMD;
          break;
      }

      const endpoint = `https://texttv.nu/api/most_read/news?count=${count}&date=${dateYMD}`;

      setIsLoading(true);
      setIsLoadingError(false);
      setPages([]);

      fetch(endpoint)
        .then(data => {
          return data.json();
        })
        .then(data => {
          // Bail if component already unmounted.
          if (isUnmounted) {
            setIsLoading(false);
            return;
          }

          setIsLoading(false);
          setPages(data.pages);
        })
        .catch(error => {
          // Network error or similar.
          setIsLoadingError(true);
        });

      return e => {
        isUnmounted = true;
      };
    }, [day, count, refreshTime]);

    const Pages = (
      <PagesListing pages={pages} history={history} linkTo="pageid" />
    );

    let Knastext = null;

    if (isLoadingError || (!isLoading && pages.length === 0)) {
      Knastext = (
        <div className="ion-padding">
          <p>
            Hm, det gick inte att hämta de mest lästa sidorna. Försök igen om en
            liten stund.
          </p>
        </div>
      );
    }

    return (
      <>
        {isLoading && SkeletonList}
        {Knastext}
        {Pages && <IonList>{Pages}</IonList>}
      </>
    );
  }
};

export default props => {
  const { selectedSegment, refreshTime } = props;

  return (
    <>
      <MestLastaLista
        {...props}
        day={selectedSegment}
        refreshTime={refreshTime}
      />
    </>
  );
};
