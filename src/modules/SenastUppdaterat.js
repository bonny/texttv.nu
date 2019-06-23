import { IonItem, IonLabel, IonList } from "@ionic/react";
import "moment/locale/sv";
import Moment from "react-moment";
import React, { useEffect, useState } from "react";
import SkeletonList from "./SkeletonList";

const SenastUppdateradeLista = props => {
  {
    const { type = "news", history, refreshTime, count = 15 } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [pages, setPages] = useState([]);

    // Fetch content for segment when segment type is changed.
    useEffect(() => {
      const endpoints = [
        {
          what: "news",
          endpoint: `https://texttv.nu/api/last_updated/news?count=${count}`
        },
        {
          what: "sports",
          endpoint: `https://texttv.nu/api/last_updated/sport?count=${count}`
        }
      ];

      let isUnmounted = false;

      let endpoint = endpoints.find(source => {
        return source.what === type;
      });

      setIsLoading(true);
      setIsLoadingError(false);
      setPages([]);

      fetch(endpoint.endpoint)
        .then(data => {
          return data.json();
        })
        .then(data => {
          setIsLoading(false);

          // Bail if component already unmounted.
          if (isUnmounted) {
            // console.log("bail because unmounted");
            return;
          }

          setPages(data.pages);
        })
        .catch(error => {
          // Network error or similar.
          setIsLoadingError(true);
        });

      return e => {
        // console.log("set is unmounted");
        isUnmounted = true;
      };
    }, [type, count, refreshTime]);

    const Pages = pages.map((page, index, arr) => {
      // No line on last item.
      const lines = index === arr.length - 1 ? "none" : "inset";
      const link = `/sida/${page.page_num}`;

      return (
        <IonItem
          button
          detail
          onClick={e => {
            history.push(link);
          }}
          key={page.id}
          lines={lines}
          color="dark"
        >
          <IonLabel text-wrap>
            <h2 className="ListHeadline">{page.title}</h2>
            <p>
              <Moment unix fromNow locale="sv" className="MomentTime">
                {page.date_added_unix}
              </Moment>
            </p>
          </IonLabel>
        </IonItem>
      );
    });

    return (
      <>
        {isLoading && SkeletonList}
        {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
        {Pages && (
          <IonList color="dark">
            {/* <IonListHeader>
              <IonLabel>Nyligen uppdaterat</IonLabel>
            </IonListHeader> */}
            {Pages}
          </IonList>
        )}
      </>
    );
  }
};

export default props => {
  const { selectedSegment, refreshTime } = props;

  return (
    <>
      <SenastUppdateradeLista
        {...props}
        type={selectedSegment}
        refreshTime={refreshTime}
      />
    </>
  );
};
