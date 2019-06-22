import { IonBackButton, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, IonSearchbar } from "@ionic/react";
import React from "react";
import { ReactComponent as Logo } from "../images/logo.svg";

const Header = props => {
  const { headerStyle, handlePageNumInputChange, handleMoreActionsClick, handleRefreshBtnClick, pageTitle } = props;
  return (<>
    {headerStyle === "HEADER_STYLE_DEFAULT" && (<IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton text="" />
        </IonButtons>
        <IonSearchbar color="primary" placeholder="Gå till sida" type="number" searchIcon="document" onIonChange={handlePageNumInputChange} />
        <IonButtons slot="end">
          <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
            <IonIcon slot="icon-only" name="share" />
          </IonButton>
          <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
            <IonIcon slot="icon-only" name="refresh" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>)}

    {headerStyle === "HEADER_STYLE_STARTPAGE" && (<IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton text="" />
        </IonButtons>
        <IonButtons slot="end">
          <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
            <IonIcon slot="icon-only" name="share" />
          </IonButton>
          <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
            <IonIcon slot="icon-only" name="refresh" />
          </IonButton>
        </IonButtons>
        <IonTitle>
          <Logo className="texttv-logo" />
          {pageTitle}
        </IonTitle>
      </IonToolbar>
      <IonToolbar color="primary">
        <IonSearchbar color="primary" placeholder="Gå till sida" type="number" searchIcon="document" onIonChange={handlePageNumInputChange} />
      </IonToolbar>
    </IonHeader>)}
  </>);
};

export default Header;
