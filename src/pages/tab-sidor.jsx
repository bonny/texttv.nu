import React from "react";
import { IonContent } from "@ionic/react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSidorLista from "../modules/TextTVSidorLista";

export default props => {
  return (
    <>
      <TextTVHeader title="Sidor" />
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={true} />
      </IonContent>
    </>
  );
};
