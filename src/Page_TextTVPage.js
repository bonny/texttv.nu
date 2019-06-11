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
  IonBackButton,
  IonItem,
  IonLabel,
  IonActionSheet,
  IonCardSubtitle
} from "@ionic/react";
import React, { useState } from "react";
import { TextTVCard } from "./texttv-card";

export const Page_TextTVPage = props => {
  // console.log('Page_TextTVPage', props);
  const { match, history } = props;
  const pageNum = match.params.pageNum;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));

  const doRefresh = e => {
    console.log("do refresh");
    setRefreshTime(Math.floor(Date.now() / 1000));
    e.target.complete();
  };

  const handleRefreshClick = e => {
    setRefreshTime(Math.floor(Date.now() / 1000));
  };

  const handleTestClick = e => {
    console.log("handle test click", props.history);
    props.history.goBack();
  };

  const handleMoreActionsClick = e => {
    console.log("handleMoreActionsClick", e);
    setActionSheetOpened(true);
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
            <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
              <IonIcon size="small" slot="icon-only" name="share" />
            </IonButton>
            <IonButton fill="clear" slot="end" onClick={handleRefreshClick}>
              <IonIcon size="small" slot="icon-only" name="refresh" />
            </IonButton>
            <IonMenuButton menu="mainMenu" />
          </IonButtons>
          <IonTitle>{pageNum}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonActionSheet
          isOpen={actionSheetOpened}
          onDidDismiss={() => setActionSheetOpened(false)}
          buttons={[
            {
              text: "Share",
              icon: "share",
              handler: () => {
                // console.log("Share clicked");
              }
            },
            {
              text: "Favorite",
              icon: "heart",
              handler: () => {
                // console.log("Favorite clicked");
              }
            },
            {
              text: "Cancel",
              icon: "close",
              role: "cancel",
              handler: () => {
                // console.log("Cancel clicked");
              }
            }
          ]}
        />

        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <TextTVCard
          pageNum={pageNum}
          history={history}
          refreshTime={refreshTime}
          size="large"
        />
      </IonContent>
    </>
  );
};
