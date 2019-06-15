import { IonItem, IonLabel, IonList, IonSkeletonText } from "@ionic/react";
import "moment/locale/sv";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";

const SenastUppdateradeLista = props => {
  {
    const { type, history, refreshTime } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [pages, setPages] = useState([]);

    // Fetch content for segment when segment type is changed.
    useEffect(() => {
      const endpoints = [
        {
          what: "news",
          endpoint: "https://texttv.nu/api/last_updated/news?count=15"
        },
        {
          what: "sports",
          endpoint: "https://texttv.nu/api/last_updated/sport?count=15"
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
    }, [type, refreshTime]);

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
          color='dark'
        >
          <IonLabel text-wrap>
            <h2>{page.title}</h2>
            <p>
              <Moment unix fromNow locale="sv">
                {page.date_added_unix}
              </Moment>
              – sid {page.page_num}
              {/* <Moment unix format="HH:mm" locale="sv">
                {page.date_added_unix}
              </Moment> */}
            </p>
          </IonLabel>
        </IonItem>
      );
    });

    const SkeletonListItems = [...Array(10)].map((val, index) => {
      const pStyles = {
        height: "12px",
        width: "80px"
      };
      const H1Style = {
        height: "24px",
        width: Math.random() * (65 - 35) + 35 + "%"
      };
      return (
        <IonItem key={index} color="dark">
          <IonLabel text-wrap>
            <p>
              <IonSkeletonText animated style={pStyles} />
            </p>
            <h1>
              <IonSkeletonText animated style={H1Style} />
            </h1>
          </IonLabel>
        </IonItem>
      );
    });

    const SkeletonList = <IonList color='dark'>{SkeletonListItems}</IonList>;

    return (
      <>
        {isLoading && SkeletonList}
        {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
        {Pages && <IonList color='dark'>{Pages}</IonList>}
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
