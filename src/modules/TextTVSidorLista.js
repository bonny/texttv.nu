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

export default props => {
  const { history, showHeader = true } = props;

  return (
    <>
      <IonList color="dark">
        {showHeader && (
          <IonListHeader color="dark">
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
              style={{
                "--border-color": "#444"
              }}
              // color="dark"
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
                {/* <p>{page.pages}</p> */}
              </IonLabel>
              <IonNote
                slot="end"
                mode="ios"
                style={{
                  fontSize: "var(--text-tv-font-size)"
                }}
              >
                {page.pages}
              </IonNote>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
};
