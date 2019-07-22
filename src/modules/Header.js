import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { copy, link, more, refresh, share } from "ionicons/icons";
import React, { useState } from "react";
import { ReactComponent as Logo } from "../images/logo.svg";
import TextTVSearchBar from "./TextTVSearchBar";

const Header = props => {
  const {
    history,
    headerStyle,
    handleMoreActionsClick,
    handleRefreshBtnClick,
    pageTitle,
    onCopyTextToClipboard,
    onCopyLinkToClipboard
  } = props;

  // const backButtonDefaultHref = `/${match.params.tab}`;
  const backButtonDefaultHref = `/hem?default`;
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState();

  const hidePopover = () => {
    setShowPopover(false);
  };

  const handleCopyTextToClipboard = () => {
    onCopyTextToClipboard();
    hidePopover();
  };

  const handleCopyLinkToClipboard = () => {
    onCopyLinkToClipboard();
    hidePopover();
  };

  return (
    <>
      {headerStyle === "HEADER_STYLE_DEFAULT" && (
        <IonHeader>
          <IonToolbar
            color="primary"
            mode="md"
            // className="ion-hide-md-down"
          >
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
              {/* <IonButton
                fill="clear"
                slot="end"
                onClick={handleMoreActionsClick}
              >
                <IonIcon slot="icon-only" icon={share} mode="md" />
              </IonButton> */}
              <IonButton
                fill="clear"
                slot="end"
                onClick={handleRefreshBtnClick}
              >
                <IonIcon slot="icon-only" icon={refresh} mode="md" />
              </IonButton>
              <IonButton
                fill="clear"
                slot="end"
                onClick={e => {
                  e.persist();
                  setPopoverEvent(e);
                  setShowPopover(true);
                }}
              >
                <IonIcon slot="icon-only" icon={more} mode="md" />
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
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
        event={popoverEvent}
      >
        <IonList>
          <IonItem button onClick={handleCopyTextToClipboard}>
            <IonIcon slot="start" icon={copy} mode="md" />
            Kopiera text
          </IonItem>
          <IonItem button onClick={handleCopyLinkToClipboard}>
            <IonIcon slot="start" icon={link} mode="md" />
            Kopiera länk
          </IonItem>
          <IonItem button>
            <IonIcon slot="start" icon={share} mode="md" />
            <IonLabel>Dela...</IonLabel>
          </IonItem>
          {/* <IonItem
            button
            slot="start"
            onClick={handleRefreshBtnClick}
          >
            <IonIcon slot="start" icon={refresh} mode="md" />
            <IonLabel>Ladda om</IonLabel>
          </IonItem> */}
        </IonList>
      </IonPopover>
    </>
  );
};

export default Header;
