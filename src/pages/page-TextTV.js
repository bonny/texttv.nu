import {
  IonActionSheet,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React, { useState } from "react";
import TextTVPage from "../modules/TextTVPage";
import { ReactComponent as Logo } from "../images/logo.svg";

const PageTextTV = props => {
  const { match, history, title } = props;
  const pageNum = props.pageNum || match.params.pageNum;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));

  let pageTitle = title || pageNum;

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(Math.floor(Date.now() / 1000));
  };

  const handlePullToRefresh = e => {
    updateRefreshTime();
    setTimeout(() => {
      e.target.complete();
    }, 750);
  };

  const handleRefreshBtnClick = e => {
    updateRefreshTime();
  };

  // const handleTestClick = e => {
  //   props.history.goBack();
  // };

  const handleMoreActionsClick = e => {
    console.log("handleMoreActionsClick", e);
    setActionSheetOpened(true);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            {/* <IonButton onClick={handleTestClick}>
              <IonIcon slot="icon-only" name="arrow-back" />
            </IonButton> */}
            <IonBackButton
            // text=''
            />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
              <IonIcon size="small" slot="icon-only" name="share" />
            </IonButton>
            <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
              <IonIcon size="small" slot="icon-only" name="refresh" />
            </IonButton>
          </IonButtons>
          <IonTitle>
            <Logo className="texttv-logo" />
            {pageTitle}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="dark">
        <IonRefresher
          slot="fixed"
          onIonRefresh={handlePullToRefresh}
          pullFactor="0.8"
          pullMin="60"
          pullMax="120"
        >
          <IonRefresherContent
            refreshingSpinner="lines-small"
            pullingText="Dra och släpp för att ladda om"
            refreshingText="Laddar om…"
          />
        </IonRefresher>

        <TextTVPage
          pageNum={pageNum}
          history={history}
          refreshTime={refreshTime}
          size="large"
        />

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
      </IonContent>
    </>
  );
};

export default PageTextTV;
