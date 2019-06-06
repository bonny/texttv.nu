import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader
} from "@ionic/react";
import React from "react";

const favorites = [
  { title: "Start", pages: "100" },
  { title: "Inrikesnyheter", pages: "101-103" },
  { title: "Utrikesnyheter", pages: "104-105" },
  { title: "Ekonomi", pages: "200-202" },
  { title: "Sport", pages: "300-302" },
  { title: "Resultatbörsen", pages: "330" },
  { title: "Målservice", pages: "376" },
  { title: "Målservice resultat", pages: " 377" },
  { title: "Målservice & resultat", pages: "376-395" },
  { title: "TV-tablåer", pages: "600, 650-656" },
  { title: "Innehåll", pages: "700" }
];

export default () => {
  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>Sidor</IonLabel>
        </IonListHeader>

        <IonItem lines="inset">
          <IonLabel position="stacked">Gå till sida …</IonLabel>
          <IonInput placeholder="100, 200, 377, …" type="number" />
        </IonItem>

        {favorites.map((page, index, arr) => {
          const lines = index === arr.length - 1 ? "none" : "inset";
          return (
            <IonItem detail href={`#${page.pages}`} key={page.pages} lines= {lines}>
              <IonLabel text-wrap>
                <h2>{page.pages}</h2>
                <p>{page.title}</p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
};
