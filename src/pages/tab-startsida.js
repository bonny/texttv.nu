import React from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import PageTextTV from "./page-TextTV.js";
import SenastUppdaterat from "../modules/SenastUppdaterat";

const Startsida = props => {
  return (
    <>
      <PageTextTV
        {...props}
        pageNum="100,300,700"
        title="TextTV.nu"
        headerStyle="HEADER_STYLE_STARTPAGE"
      >
        <IonGrid no-padding>
          <IonRow className="ion-justify-content-center">
            <IonCol className="u-max-width-texttvpage">
              <h2 className="ion-padding-start ion-padding-top ion-padding-end ion-text-left">
                Senaste nyheterna
              </h2>
              <SenastUppdaterat {...props} selectedSegment="news" count="5" />

              <h2 className="ion-padding-start ion-padding-top ion-padding-end ion-text-left">
                Senaste sportnyheterna
              </h2>
              <SenastUppdaterat {...props} selectedSegment="sports" count="5" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </PageTextTV>
    </>
  );
};

export default Startsida;
