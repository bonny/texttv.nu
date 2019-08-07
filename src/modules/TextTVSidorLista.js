import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote
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
  { title: "Målservice resultat", pages: "377" },
  { title: "Målservice & resultat", pages: "376-395" },
  { title: "TV-tablåer", pages: "600, 650-656" },
  { title: "Innehåll", pages: "700" }
];

const TextTVSidorLista = props => {
  const { history, showHeader = true } = props;

  return (
    <>
      <IonList>
        {showHeader && (
          <IonListHeader>
            <IonLabel>Sidor</IonLabel>
          </IonListHeader>
        )}

        {favorites.map((page, index, arr) => {
          const lines = index === arr.length - 1 ? "none" : "inset";
          const url = `/sidor/${page.pages}`;
          return (
            <IonItem
              button
              detail
              onClick={() => {
                document.querySelector("ion-menu-controller").close();
                history.push(url);
              }}
              key={page.pages}
              lines={lines}
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
                {/* <p>{page.pages}</p> */}
              </IonLabel>
              <IonNote slot="end" mode="ios" className="ListPageNum">
                {page.pages}
              </IonNote>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
};

export default TextTVSidorLista;
