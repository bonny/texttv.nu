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
import React, { useEffect } from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import { TextTVSidorLista } from "./modules/TextTVSidorLista";
import { TextTVLargeCard, TextTVThumbnailCard } from "./texttv-card";

export const TabHome = props => {
  const { history } = props;

  useEffect(e => {
    // console.log("useEffect in TabHome", e);
  });

  return (
    <>
      <TextTVHeader />

      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>

        <TextTVLargeCard pageNum="100" history={history} />
        <TextTVLargeCard pageNum="300" history={history} />
        <TextTVLargeCard pageNum="700" history={history} />

        {/* <IonGrid>
          <IonRow>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="300" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="700" />
            </IonCol>
          </IonRow>
        </IonGrid> */}

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
          isOpen={true}
          // onDidDismiss={() => this.setState(() => ({ showToast1: false }))}
          message="Your settings have been saved."
          duration={200}
        />

        <IonToast
          isOpen={true}
          // onDidDismiss={() => this.setState(() => ({ showToast2: false }))}
          message="Click to Close"
          position="top"
          buttons={[
            {
              side: "start",
              icon: "star",
              text: "Favorite",
              handler: () => {
                console.log("Favorite clicked");
              }
            },
            {
              text: "Done",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              }
            }
          ]}
        />
      </IonContent>
    </>
  );
};
