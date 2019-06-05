import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem
} from "@ionic/react";
import React from "react";
import { TextTVLargeCard, TextTVThumbnailCard } from "./texttv-card";
import { TextTVHeader } from "./modules/TextTVHeader";
import { TextTVFavoriterLista } from "./modules/TextTVFavoriterLista";

export const TabHome = () => {
  return (
    <>
      <TextTVHeader />

      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>

        <TextTVLargeCard pageNum="100" />

        <IonCard>
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
          </IonCardContent>
        </IonCard>

        <TextTVFavoriterLista />

        <IonListHeader>
          <IonLabel>Gå till sida</IonLabel>
        </IonListHeader>
        <IonToolbar>
          <IonSearchbar
            placeholder="100, 200, 377, ..."
            searchIcon="document"
            type="number"
          />
        </IonToolbar>

        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonListHeader>
                <IonLabel>Items</IonLabel>
              </IonListHeader>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="101" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="102" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="103" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="104" />
            </IonCol>
            <IonCol size="6">
              <TextTVThumbnailCard pageNum="105" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};
