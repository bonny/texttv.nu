import React from "react";
import { IonContent } from "@ionic/react";
import TextTVHeader from "../modules/TextTVHeader";

export default props => {
  return (
    <>
      <TextTVHeader />
      <IonContent color="dark" padding>
        <p>Hejsan</p>
      </IonContent>
    </>
  );
};
