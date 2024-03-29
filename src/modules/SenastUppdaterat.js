import { IonList } from "@ionic/react";
import { useEffect, useState } from "react";
import SkeletonList from "./SkeletonList";
import { PagesListing } from "./PagesListing";

const SenastUppdateradeLista = (props) => {
  const { type = "news", history, refreshTime, count = 15 } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [pages, setPages] = useState([]);

  // Fetch content for segment when segment type is changed.
  useEffect(() => {
    const endpoints = [
      {
        what: "news",
        endpoint: `https://texttv.nu/api/last_updated/news?count=${count}`,
      },
      {
        what: "sports",
        endpoint: `https://texttv.nu/api/last_updated/sport?count=${count}`,
      },
    ];

    let isUnmounted = false;

    let endpoint = endpoints.find((source) => {
      return source.what === type;
    });

    setIsLoading(true);
    setIsLoadingError(false);
    setPages([]);

    fetch(endpoint.endpoint)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setIsLoading(false);

        // Bail if component already unmounted.
        if (isUnmounted) {
          return;
        }

        setPages(data.pages);
      })
      .catch((error) => {
        // Network error or similar.
        setIsLoadingError(true);
      });

    return (e) => {
      isUnmounted = true;
    };
  }, [type, count, refreshTime]);

  const Pages = (
    <PagesListing pages={pages} history={history} listingType="latestUpdated" />
  );

  return (
    <>
      {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
      {isLoading && SkeletonList}
      {Pages && <IonList>{Pages}</IonList>}
    </>
  );
};

const SenastUppdaterat = (props) => {
  const { selectedSegment, refreshTime, ...rest } = props;

  return (
    <>
      <SenastUppdateradeLista
        type={selectedSegment}
        refreshTime={refreshTime}
        {...rest}
      />
    </>
  );
};

export { SenastUppdaterat };
