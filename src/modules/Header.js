import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonSearchbar
} from "@ionic/react";
import React from "react";
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
              color="secondary"
              placeholder="Gå till…"
              type="number"
              onIonChange={handlePageNumInputChange}
              showCancelButton={false}
              clearIcon={false}  
            />
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" name="share" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" name="refresh" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      {headerStyle === "HEADER_STYLE_STARTPAGE" && (
        <IonHeader>
          <IonToolbar color="primary" mode="md">
            {/* <IonButtons slot="start">
          <IonBackButton text="" />
        </IonButtons> */}
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" name="share" mode="md" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" name="refresh" mode="md" />
              </IonButton>
            </IonButtons>
            <IonTitle>
              <Logo className="texttv-logo" />
              {pageTitle}
            </IonTitle>
          </IonToolbar>
          <IonToolbar color="primary">
            <IonSearchbar
              color="secondary"
              placeholder="Gå till…"
              type="number"
              onIonChange={handlePageNumInputChange}
              showCancelButton={false}
              clearIcon={false}  
            />
          </IonToolbar>
        </IonHeader>
      )}
    </>
  );
};

export default Header;
