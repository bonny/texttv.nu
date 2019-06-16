import React from "react";
import { IonContent, IonToolbar, IonSearchbar } from "@ionic/react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSidorLista from "../modules/TextTVSidorLista";

export default props => {
  const { history } = props;

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
      <TextTVHeader title="Sidor">
        <IonToolbar color="primary">
          <IonSearchbar
            color="primary"
            placeholder='Gå till "100", "200", "377" …'
            onIonChange={handlePageNumInputChange}
            showCancelButton={false}
            clearIcon={false}
            type="number"
            // searchIcon="document"
          />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
