import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  IonButton
} from "@ionic/react";

import React from "react";

export const TextTVHeader = () => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="primary">
          <IonButton>
            <IonIcon slot="icon-only" name="document" />
          </IonButton>
          <IonButton>
            <IonIcon slot="icon-only" name="menu" />
          </IonButton>
        </IonButtons>
        <IonTitle>TextTV.nu</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
