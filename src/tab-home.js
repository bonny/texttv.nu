import {
  IonCol,
  IonContent,
  IonGrid,
  IonLabel,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonCardContent,
  IonItem,
  IonIcon,
  IonToolbar,
  IonButtons,
  IonTitle
} from "@ionic/react";
import React, { useEffect } from "react";
import { TextTVHeader } from "./modules/TextTVHeader";
import TextTVSidorLista from "./modules/TextTVSidorLista";
import { TextTVLargeCard, TextTVThumbnailCard } from "./texttv-card";

export const TabHome = props => {
  // const { currentTab, prevTab } = props;

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

        <TextTVLargeCard pageNum="100" />

        <IonGrid>
          {/* <IonRow>
            <IonCol size="6">
              <IonListHeader>
                <IonLabel>Items</IonLabel>
              </IonListHeader>
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="300" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="700" />
            </IonCol>
          </IonRow>
        </IonGrid>

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
                <IonButton color="primary" size="small">Ändra</IonButton>
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

        <TextTVSidorLista />
      </IonContent>
    </>
  );
};
