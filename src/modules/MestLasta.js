import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import React, { useState } from "react";

const mostReadToday = [
  {
    title: "Sommarskola tycks bli en flopp | Man död i fyrhjulingsolycka",
    page: 127,
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

const mostReadYesterday = [
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

const MestLästaLista = props => {
  {
    const { day } = props;

    const pagesArray = day === "today" ? mostReadToday : mostReadYesterday;

    return pagesArray.map((page, index, arr) => {
      const imgSrc = `https://texttv.nu/api/screenshot/${page.id}.jpg`;

      // No line on last item.
      const lines = index === arr.length - 1 ? "none" : "inset";

      return (
        <IonItem detail href={`#${page.page}`} key={page.id} lines={lines}>
          <IonThumbnail slot="start">
            <IonImg src={imgSrc} />
          </IonThumbnail>
          <IonLabel text-wrap>
            <h2>{page.title}</h2>
          </IonLabel>
          <IonBadge slot="end" color="light">
            {page.page}
          </IonBadge>
        </IonItem>
      );
    });
  }
};

export const MestLästa = () => {
  const [selectedSegment, setSelectedSegment] = useState("today");

  const handleSegmentChange = e => {
    setSelectedSegment(e.detail.value);
  };

  return (
    <>
      <IonToolbar>
        <IonSegment onIonChange={handleSegmentChange} value={selectedSegment}>
          <IonSegmentButton value="today">Mest läst idag</IonSegmentButton>
          <IonSegmentButton value="yesterday">Mest läst igår</IonSegmentButton>
        </IonSegment>
      </IonToolbar>

      <IonList>
        {/* <IonListHeader>
        <IonLabel>Mest lästa</IonLabel>
      </IonListHeader> */}
        <MestLästaLista day={selectedSegment} />
      </IonList>
    </>
  );
};
