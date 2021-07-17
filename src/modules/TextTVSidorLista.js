import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonChip,
  IonButton,
} from "@ionic/react";
import { useContext, useState } from "react";
import { favoriter } from "./favoriter";
import { RedigeraFavoriter } from "./RedigeraFavoriter";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { saveFavorites, logPageView } from "../functions";

const TextTVSidorLista = (props) => {
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
            {userFavorites.pages.map((pageNum) => {
              const url = `/sidor/${pageNum}`;
              return (
                <IonChip
                  button
                  detail
                  onClick={() => {
                    logPageView(pageNum, "menu_pages_favorites");
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
        handleSaveModal={(pages) => {
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

        {favoriter.map((page, index, arr) => {
          const pages = page.pages;
          const url = page.href ? page.href : `/sidor/${pages}`;

          return (
            <IonItem
              button
              detail
              onClick={(e) => {
                e.preventDefault();
                logPageView(page.isHome ? "home" : pages, "menu_pages");
                history.push(url);
              }}
              key={url}
              href={url}
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
