import {
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonSkeletonText
} from "@ionic/react";
import "moment/locale/sv";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";

const updatedNews = [
  {
    title:
      "Allvarlig olycka norr om Nässjöommarskola tycks bli en flopp | Man död i fyrhjulingsolycka",
    page: 116,
    id: 23371619
  },
  {
    title: "Ingen kryssade sig förbi partitop",
    page: 128,
    id: 23374243
  },
  {
    title: "Man död i fyrhjulingsolycka",
    page: 111,
    id: 23367686
  },
  {
    title: "Filmstudior hotar lämna Georgia",
    page: 107,
    id: 23365449
  },
  {
    title: "Flyget lika stor bov som bilar",
    page: 112,
    id: 23315050
  },
  {
    title: "Man död i fyrhjulingsolycka",
    page: 111,
    id: 23317686
  },
  {
    title: "Filmstudior hotar lämna Georgia",
    page: 107,
    id: 23362449
  },
  {
    title: "Flyget lika stor bov som bilar",
    page: 112,
    id: 23361050
  }
];

const updatedSports = [
  {
    title: "En sida som lästes mest igår. Typ jättemycket lästes den.",
    page: 127,
    id: 23371619
  },
  {
    title: "En annan grej som lästes mycket igår",
    page: 128,
    id: 23374243
  },
  {
    title: "Bla bla bla osv",
    page: 111,
    id: 23367686
  },
  {
    title: "Culpa velit labore esse culpa ea cillum proident",
    page: 107,
    id: 23365449
  },
  {
    title: "Laboris do qui eu esse pariatur sunt irure consequat",
    page: 112,
    id: 23315050
  }
];

const SenastUppdateradeLista = props => {
  {
    const { type, history } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingError, setIsLoadingError] = useState(false);
    const [pages, setPages] = useState([]);

    const endpoints = [
      {
        what: "news",
        endpoint: "https://texttv.nu/api/last_updated/news?count=10"
      },
      {
        what: "sports",
        endpoint: "https://texttv.nu/api/last_updated/sport?count=10"
      }
    ];

    // Fetch content for segment when segment type is changed.
    useEffect(() => {
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
    }, [type]);

    const Pages = pages.map((page, index, arr) => {
      // No line on last item.
      const lines = index === arr.length - 1 ? "none" : "inset";
      const link = `/sida/${page.page_num}`;

      return (
        <IonItem
          detail
          onClick={e => {
            props.history.push(link);
          }}
          key={page.id}
          lines={lines}
        >
          {/* <IonThumbnail slot="start">
            <IonImg src={imgSrc} />
          </IonThumbnail> */}
          <IonLabel text-wrap>
            <p>
              <Moment unix format="HH:mm" locale="sv">
                {page.date_added_unix}
              </Moment>{" "}
              • {page.page_num}
            </p>
            <h1>{page.title}</h1>
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
        <IonItem key={index}>
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
    const SkeletonList = <IonList>{SkeletonListItems}</IonList>;

    return (
      <>
        {isLoading && SkeletonList}
        {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
        {Pages && <IonList>{Pages}</IonList>}
      </>
    );
  }
};

export default props => {
  const [selectedSegment, setSelectedSegment] = useState("news");
  const { history } = props;

  const handleSegmentChange = e => {
    setSelectedSegment(e.detail.value);
  };

  return (
    <>
      <IonToolbar>
        <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
          <IonSegmentButton value="news">Nyheter</IonSegmentButton>
          <IonSegmentButton value="sports">Sport</IonSegmentButton>
        </IonSegment>
      </IonToolbar>

      <SenastUppdateradeLista {...props} type={selectedSegment} />
    </>
  );
};
