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
  IonToolbar,
  IonSearchbar
} from "@ionic/react";
import React, { useState } from "react";
import TextTVPage from "../modules/TextTVPage";
import { ReactComponent as Logo } from "../images/logo.svg";

const Header = props => {
  const {
    headerStyle,
    handlePageNumInputChange,
    handleMoreActionsClick,
    handleRefreshBtnClick,
    pageTitle
  } = props;
  return (
    <>
      {headerStyle === "HEADER_STYLE_DEFAULT" && (
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton text="" />
            </IonButtons>
            <IonSearchbar
              color="primary"
              placeholder="Gå till sida"
              type="number"
              searchIcon="document"
              onIonChange={handlePageNumInputChange}
            />
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon size="small" slot="icon-only" name="share" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon size="small" slot="icon-only" name="refresh" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      {headerStyle === "HEADER_STYLE_STARTPAGE" && (
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton text="" />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon size="small" slot="icon-only" name="share" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon size="small" slot="icon-only" name="refresh" />
              </IonButton>
            </IonButtons>
            <IonTitle>
              <Logo className="texttv-logo" />
              {pageTitle}
            </IonTitle>
          </IonToolbar>
          <IonToolbar color="primary">
            <IonSearchbar
              color="primary"
              placeholder="Gå till sida"
              type="number"
              searchIcon="document"
              onIonChange={handlePageNumInputChange}
            />
          </IonToolbar>
        </IonHeader>
      )}
    </>
  );
};

const PageTextTV = props => {
  const { match, history, title, headerStyle = "HEADER_STYLE_DEFAULT" } = props;
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

  const handlePageNumInputChange = e => {
    const pageNum = e.target.value;
    if (pageNum.length === 3) {
      history.push(`/sida/${pageNum}`);
      e.target.value = "";
      document.querySelector("ion-menu-controller").close();
    }
  };

  // const handleTestClick = e => {
  //   props.history.goBack();
  // };

  const handleMoreActionsClick = e => {
    console.log("handleMoreActionsClick", e);
    setActionSheetOpened(true);
  };

  const HeaderMemoed = React.memo(props => {
    return <Header {...props} />;
  });

  return (
    <>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        handlePageNumInputChange={handlePageNumInputChange}
        handleMoreActionsClick={handleMoreActionsClick}
        handleRefreshBtnClick={handleRefreshBtnClick}
      />

      <IonContent color="dark">
        <IonRefresher
          slot="fixed"
          onIonRefresh={handlePullToRefresh}
          pullFactor="0.6"
          pullMin="60"
          pullMax="240"
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
