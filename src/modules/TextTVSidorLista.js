import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonChip,
  IonButton
} from "@ionic/react";
import React, { useContext, useState } from "react";
import favorites from "./favorites";
import RedigeraFavoriter from "./RedigeraFavoriter";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { saveFavorites } from "../functions";

const TextTVSidorLista = props => {
  const { history } = props;
  const userFavorites = useContext(FavoritesContext);
  const [showEditFavoritesModal, setShowEditFavoritesModal] = useState(false);

  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>Favoriter</IonLabel>
          <IonButton
            color="secondary"
            onClick={() => {
              setShowEditFavoritesModal(true);
            }}
          >
            Ändra
          </IonButton>
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

      <RedigeraFavoriter
        isOpen={showEditFavoritesModal}
        pages={userFavorites.pages}
        handleSaveModal={pages => {
          saveFavorites(pages);
          userFavorites.setPages(pages);
          setShowEditFavoritesModal(false);
        }}
        handleCancelModal={() => {
          setShowEditFavoritesModal(false);
        }}
      />

      <IonList>
        <IonListHeader>
          <IonLabel>Sidor</IonLabel>
        </IonListHeader>

        {favorites.map((page, index, arr) => {
          const pages = page.pages;
          const url = page.href ? page.href : `/sidor/${pages}`;

          return (
            <IonItem
              button
              detail
              onClick={() => {
                history.push(url);
              }}
              key={url}
              lines="none"
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
              </IonLabel>
              <IonNote slot="end" className="ListPageNum" color="medium">
                {pages}
              </IonNote>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
};

export default TextTVSidorLista;
