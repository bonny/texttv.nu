import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSearchbar,
  IonToolbar
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

  const handlePageNumInputChange = e => {
    const pageNum = e.target.value;
    if (pageNum.length === 3) {
      history.push(`/sida/${pageNum}`);
      e.target.value = "";
      document.querySelector("ion-menu-controller").close();
    }
  };

  return (
    <>
      <IonToolbar color="primary">
        <IonSearchbar
          color="primary"
          placeholder="Skriv in sida 100, 200, 377 …"
          onIonChange={handlePageNumInputChange}
          showCancelButton={false}
          clearIcon={false}
          // searchIcon="document"
        />
      </IonToolbar>
      <IonToolbar color="dark">
        <IonSearchbar
          color="dark"
          placeholder="Skriv in sida 100, 200, 377 …"
          onIonChange={handlePageNumInputChange}
          showCancelButton={false}
          clearIcon={false}
          // searchIcon="document"
        />
      </IonToolbar>
      <IonSearchbar
        color="dark"
        placeholder="Skriv in sida 100, 200, 377 …"
        onIonChange={handlePageNumInputChange}
        showCancelButton={false}
        clearIcon={false}
        // searchIcon="document"
      />
      <IonList color="dark">
        <IonSearchbar
          color="dark"
          placeholder="Skriv in sida 100, 200, 377 …"
          onIonChange={handlePageNumInputChange}
          showCancelButton={false}
          clearIcon={false}
          // searchIcon="document"
        />

        {showHeader && (
          <IonListHeader color="dark">
            <IonLabel>Sidor</IonLabel>
          </IonListHeader>
        )}

        <IonSearchbar
          color="dark"
          placeholder="Skriv in sida 100, 200, 377 …"
          onIonChange={handlePageNumInputChange}
          showCancelButton={false}
          clearIcon={false}
          // searchIcon="document"
        />

        <IonItem lines="inset" color="dark">
          <IonLabel position="stacked">
            <h2>Gå till sida</h2>
          </IonLabel>
          <IonInput
            placeholder="Skriv in sida 100, 200, 377 …"
            type="number"
            onIonChange={handlePageNumInputChange}
          />
        </IonItem>

        {favorites.map((page, index, arr) => {
          const lines = index === arr.length - 1 ? "none" : "inset";
          const url = `/sida/${page.pages}`;
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
              color="dark"
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
                <p>{page.pages}</p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
};
