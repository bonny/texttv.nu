import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  useIonViewWillEnter,
  IonChip
} from "@ionic/react";
import React, { useState } from "react";
import favorites from "./favorites";
import { getFavorites } from "../functions";

const TextTVSidorLista = props => {
  const { history } = props;
  const [favoritePages, setFavoritePages] = useState([]);

  useIonViewWillEnter(() => {
    async function getFavs() {
      const favoritePages = await getFavorites();
      setFavoritePages(favoritePages);
      console.log("yo", favoritePages);
    }

    getFavs();
  });

  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>Favoriter</IonLabel>
        </IonListHeader>

        <IonItem lines="none" class="ion-text-wrap">
          <IonLabel text-wrap class="ion-text-wrap">
            {favoritePages.map(pageNum => {
              const url = `/sidor/${pageNum}`;
              return (
                <IonChip
                  button
                  detail
                  onClick={() => {
                    history.push(url);
                  }}
                  key={pageNum}
                  lines="none"
                >
                  <IonLabel>{pageNum}</IonLabel>
                </IonChip>
              );
            })}
          </IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Sidor</IonLabel>
        </IonListHeader>

        {favorites.map((page, index, arr) => {
          const url = `/sidor/${page.pages}`;
          return (
            <IonItem
              button
              detail
              onClick={() => {
                history.push(url);
              }}
              key={page.pages}
              lines="none"
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
              </IonLabel>
              <IonNote
                slot="end"
                mode="ios"
                className="ListPageNum"
                color="medium"
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

export default TextTVSidorLista;
