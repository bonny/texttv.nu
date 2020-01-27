import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonChip
} from "@ionic/react";
import React, { useContext } from "react";
import favorites from "./favorites";
import { FavoritesContext } from "../contexts/FavoritesContext";

const TextTVSidorLista = props => {
  const { history } = props;
  const userFavorites = useContext(FavoritesContext);
  
  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>Favoriter</IonLabel>
        </IonListHeader>

        <IonItem lines="none" class="ion-text-wrap">
          <IonLabel text-wrap class="ion-text-wrap">
            {userFavorites.pages.map(pageNum => {
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
