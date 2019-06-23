import { IonList } from "@ionic/react";
import React, { useState, useEffect } from "react";
import SkeletonList from "./SkeletonList";
import PagesListing from "./PagesListing";

const MestLastaLista = props => {
  {
    const { history, day = "today", refreshTime, count = 15 } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [pages, setPages] = useState([]);

    // Fetch content for segment when segment day is changed.
    useEffect(() => {
      let isUnmounted = false;

      const endpoint = `https://texttv.nu/api/most_read/news?count=${count}`;

      setIsLoading(true);
      setIsLoadingError(false);
      setPages([]);

      fetch(endpoint)
        .then(data => {
          return data.json();
        })
        .then(data => {
          setIsLoading(false);

          // Bail if component already unmounted.
          if (isUnmounted) {
            return;
          }

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

    const Pages = <PagesListing pages={pages} history={history} />;

    return (
      <>
        {isLoading && SkeletonList}
        {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
        {Pages && <IonList color="dark">{Pages}</IonList>}
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
