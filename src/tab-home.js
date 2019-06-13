import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonToolbar,
  IonToast
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import { TextTVSidorLista } from "./modules/TextTVSidorLista";
import TextTVPage from "./modules/TextTVPage.jsx";

export const TabHome = props => {
  const { history } = props;
  const [toastIsOpened, setToastIsOpened] = useState(false);

  setTimeout(() => {
    setToastIsOpened(true);
  }, 3000);

  useEffect(e => {
    // console.log("useEffect in TabHome", e);
  });

  const doRefresh = e => {
    console.log("do refresh");
    // setRefreshTime(Math.floor(Date.now() / 1000));
    e.target.complete();
  };

  return (
    <>
      <TextTVHeader />

      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent onIonRefresh={doRefresh} />
        </IonRefresher>

        <TextTVPage pageNum="100" history={history} />
        <TextTVPage pageNum="300" history={history} />
        <TextTVPage pageNum="700" history={history} />

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tips: Ändra startsidor</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Du kan ändra vilka sidor som ska visas här på hemskärmen.</p>
          </IonCardContent>

          <IonItem lines="none">
            <IonToolbar>
              <IonButtons slot="secondary">
                <IonButton size="small">Kanske senare</IonButton>
              </IonButtons>
              <IonButtons slot="primary">
                <IonButton color="primary" size="small">
                  Ändra
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonItem>
        </IonCard>

        {/* <IonCard>
          <IonCardHeader>
            <IonButton
              fill="clear"
              className="ion-float-right"
              color="medium"
              size="small"
            >
              <IonIcon slot="icon-only" name="close-circle" />
            </IonButton>
            <IonCardTitle>Välkommen till nya text tv-appen</IonCardTitle>
            <IonCardSubtitle>Från texttv.nu</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Keep close to Nature's heart... and break clear away, once in
            awhile, and climb a mountain or spend a week in the woods. Wash your
            spirit clean.
            <br />
            <br />currentTab: {currentTab}
            <br />prevTab: {prevTab}
          </IonCardContent>
        </IonCard> */}

        {/* Göm listan med sid-genvägar på bredare skärmar då 
        genvägarna istället alltid är synliga i sidomenyn */}
        <div className="ion-hide-lg-up">
          <TextTVSidorLista {...props} />
        </div>

        <IonToast
          isOpen={toastIsOpened}
          // onDidDismiss={() => this.setState(() => ({ showToast1: false }))}
          message="Your settings have been saved."
          duration={1000}
        />
      </IonContent>
    </>
  );
};
