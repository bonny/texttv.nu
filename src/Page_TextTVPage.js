import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonBackButton
} from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "./images/logo.svg";
import { TextTVCard } from "./texttv-card";

export const Page_TextTVPage = props => {
  // console.log('Page_TextTVPage', props);

  const { match, history } = props;
  const doRefresh = e => {
    console.log("do refresh");
  };

  const handleTestClick = e => {
    console.log("handle test click", props.history);
    props.history.goBack();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={handleTestClick}>
              <IonIcon slot="icon-only" name="arrow-back" />
            </IonButton>
            <IonBackButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonMenuButton menu="mainMenu" />
          </IonButtons>
          <IonTitle>
            <Logo className="texttv-logo" />
            TextTV.nu textvpage
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <TextTVCard pageNum={match.params.pageNum} history={history} size='large' />
      </IonContent>
    </>
  );
};
