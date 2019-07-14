import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { share, refresh } from "ionicons/icons";

import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";
import TextTVSearchBar from "./TextTVSearchBar";

const Header = props => {
  const {
    history,
    headerStyle,
    handleMoreActionsClick,
    handleRefreshBtnClick,
    pageTitle
  } = props;

  // const backButtonDefaultHref = `/${match.params.tab}`;
  const backButtonDefaultHref = `/sidor/100?default`;

  return (
    <>
      {headerStyle === "HEADER_STYLE_DEFAULT" && (
        <IonHeader>
          <IonToolbar color="primary" mode="md" className="ion-hide-md-down">
            <IonTitle>
              <Logo className="texttv-logo" />
              TextTV.nu
            </IonTitle>
          </IonToolbar>

          <IonToolbar color="dark" mode="md">
            <IonButtons slot="start">
              <IonBackButton defaultHref={backButtonDefaultHref} />
            </IonButtons>

            <TextTVSearchBar history={history} />

            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" icon={share} mode="md" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" icon={refresh} mode="md" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      {headerStyle === "HEADER_STYLE_STARTPAGE" && (
        <IonHeader>
          <IonToolbar color="primary" mode="md">
            <IonTitle>
              <Logo className="texttv-logo" />
              {pageTitle}
            </IonTitle>

            {/* <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" icon={share} mode="md" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" icon={refresh} mode="md" />
              </IonButton> 
            </IonButtons>*/}
          </IonToolbar>
          <IonToolbar color="dark">
            <TextTVSearchBar history={history} />
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" icon={share} mode="md" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" icon={refresh} mode="md" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}
    </>
  );
};

export default Header;
