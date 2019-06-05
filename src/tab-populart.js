import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonMenuButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React from "react";
import { MestLästa } from "./modules/MestLasta";
import { TextTVHeader } from "./modules/TextTVHeader";

export const TabPopulart = () => {
  return (
    <>
      <TextTVHeader />
      <IonContent>
        <MestLästa />
      </IonContent>
    </>
  );
};
