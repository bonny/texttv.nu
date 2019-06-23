import { IonItem, IonLabel, IonList } from "@ionic/react";
import "moment/locale/sv";
import Moment from "react-moment";
import React, { useState, useEffect } from "react";
import SkeletonList from "./SkeletonList";

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
        isUnmounted = true;
      };
    }, [day, count, refreshTime]);

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
