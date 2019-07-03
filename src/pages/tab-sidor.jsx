import { IonContent, IonToolbar } from "@ionic/react";
import React from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSidorLista from "../modules/TextTVSidorLista";
import TextTVSearchBar from "../modules/TextTVSearchBar";

export default props => {
  const { history } = props;

  return (
    <>
      <TextTVHeader title="Sidor">
        <IonToolbar color="primary">
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
