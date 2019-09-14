import {
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote
} from "@ionic/react";
import React from "react";
import favorites from "./favorites";

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
          // const lines = index === arr.length - 1 ? "none" : "inset";
          const url = `/sidor/${page.pages}`;
          return (
            <IonItem
              button
              detail
              onClick={() => {
                // document.querySelector("ion-menu-controller").close();
                history.push(url);
              }}
              key={page.pages}
              lines='none'
            >
              <IonLabel text-wrap>
                <h2 className="ListHeadlineSidor">{page.title}</h2>
                {/* <p>{page.pages}</p> */}
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
