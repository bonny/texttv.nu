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
  IonToolbar,
  IonToast
} from "@ionic/react";
import { copy, link, more, refresh, share, open } from "ionicons/icons";
import React, { useState, useContext } from "react";
import { ReactComponent as Logo } from "../images/logo.svg";
import TextTVSearchBar from "./TextTVSearchBar";
import { IonicContext } from "@ionic/react";

const Header = props => {
  const {
    history,
    headerStyle,
    onShare,
    handleRefreshBtnClick,
    onCopyTextToClipboard,
    onCopyLinkToClipboard,
    onOpenLinkInBrowser
  } = props;

  // const backButtonDefaultHref = `/${match.params.tab}`;
  const backButtonDefaultHref = `/hem?default`;
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState();
  const ionicContext = useContext(IonicContext);
  const [actionPerformedToastOpened, setActionPerformedToastOpened] = useState(
    false
  );
  const [actionPerformedMessage, setActionPerformedMessage] = useState("");

  // Visa endast share-knappen om denna variabel är true.
  // Vi sätter den till false för t.ex. chrome desktop där web share inte finns ännu.
  let showShare = true;

  // Om desktop kolla om web share stöds.
  if (ionicContext.platform.is("desktop") && navigator.share === undefined) {
    showShare = false;
  }

  const hidePopover = () => {
    setShowPopover(false);
  };

  const handleCopyTextToClipboard = () => {
    onCopyTextToClipboard();
    setActionPerformedMessage("Sidans text kopierades till urklipp");
    setActionPerformedToastOpened(true);
    hidePopover();
  };

  const handleCopyLinkToClipboard = () => {
    onCopyLinkToClipboard();
    setActionPerformedMessage("Sidans länk kopierades till urklipp");
    setActionPerformedToastOpened(true);
    hidePopover();
  };

  const handleOpenLink = () => {
    onOpenLinkInBrowser();
    hidePopover();
  };

  const handleShareClick = () => {
    onShare();
    hidePopover();
  };

  /**
   * headerStyle:
   * HEADER_STYLE_DEFAULT = utseende som används på sidor, med tillbaka-knapp
   * HEADER_STYLE_STARTPAGE = utseende för startsidan, utan tillbaka-knapp
   */
  const backButton =
    headerStyle === "HEADER_STYLE_STARTPAGE" ? null : (
      <IonBackButton defaultHref={backButtonDefaultHref} text="" />
    );

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary" mode="md">
          <IonTitle>
            <Logo className="texttv-logo" />
            TextTV.nu
          </IonTitle>
        </IonToolbar>

        <IonToolbar mode="md">
          <IonButtons slot="start">{backButton}</IonButtons>

          <TextTVSearchBar history={history} />

          <IonButtons slot="end">
            <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
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
          <IonItem button onClick={handleOpenLink}>
            <IonIcon slot="start" icon={open} mode="md" />
            Öppna i webbläsare
          </IonItem>
          {showShare && (
            <IonItem button onclick={handleShareClick}>
              <IonIcon slot="start" icon={share} mode="md" />
              <IonLabel>Dela...</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonPopover>

      <IonToast
        xcolor="success"
        isOpen={actionPerformedToastOpened}
        onDidDismiss={() => {
          setActionPerformedToastOpened(false);
        }}
        message={actionPerformedMessage}
        position="bottom"
        duration="2500"
        cssClass="TextTVPage_Toast"
      />
    </>
  );
};

export default Header;
