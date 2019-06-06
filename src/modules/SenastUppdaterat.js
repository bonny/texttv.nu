import {
  IonBadge,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonToolbar,
  IonContent
} from "@ionic/react";
import React, { useState, useEffect } from "react";

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
    const { type } = props;
    const pagesArray = type === "news" ? updatedNews : updatedSports;

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

    useEffect(() => {
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
          console.log("fetched then json data", data);
          setIsLoading(false);
          setPages(data.pages);
        })
        .catch(error => {
          // Network error or similar.
          console.log("fetch catch", error, JSON.stringify(error));
          setIsLoadingError(true);
        });
    }, [type]);

    const Pages = pages.map((page, index, arr) => {
      const imgSrc = `https://texttv.nu/api/screenshot/${page.id}.jpg`;

      // No line on last item.
      const lines = index === arr.length - 1 ? "none" : "inset";

      return (
        <IonItem detail href={`/sida/${page.page_num}`} key={page.id} lines={lines}>
          {/* <IonThumbnail slot="start">
            <IonImg src={imgSrc} />
          </IonThumbnail> */}
          <IonLabel text-wrap>
            <h2>{page.title}</h2>
            <p>{page.date_added}</p>
          </IonLabel>
          <IonBadge slot="end" color="light">
            {page.page_num}
          </IonBadge>
        </IonItem>
      );
    });

    return (
      <>
        {/* {isLoading && <p>Laddar ...</p>} */}
        {isLoadingError && <p>Det blev ett fel vid laddning ...</p>}
        {Pages && <IonList>{Pages}</IonList>}
      </>
    );
  }
};

export default () => {
  const [selectedSegment, setSelectedSegment] = useState("news");

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

      <SenastUppdateradeLista type={selectedSegment} />
    </>
  );
};
