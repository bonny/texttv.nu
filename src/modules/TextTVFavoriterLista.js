import { IonInput, IonItem, IonLabel, IonList } from "@ionic/react";
import React from "react";
const favorites = [
  {
    title: "Start",
    page: 100
  },
  {
    title: "Inrikesnyheter",
    page: "101-105"
  },
  {
    title: "Utrikesnyheter",
    page: "104-105"
  },
  {
    title: "Sport",
    page: "300-302"
  }
];
export const TextTVFavoriterLista = () => {
  return (<>
    <IonList>
      <ion-list-header>
        <ion-label>Favoriter</ion-label>
      </ion-list-header>

      {favorites.map(page => {
        return (<IonItem detail href={`#${page.page}`} key={page.page}>
          <IonLabel text-wrap>
            <h2>{page.title}</h2>
            <p>{page.page}</p>
          </IonLabel>


        </IonItem>);
      })}

      <IonItem>
        <IonLabel position="stacked">
          <h2>Gå till sida …</h2>
        </IonLabel>
        <IonInput placeholder="100, 200, 377, …" />
      </IonItem>
    </IonList>
  </>);
};
