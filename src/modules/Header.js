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
  IonToast,
  IonToolbar,
  isPlatform
} from "@ionic/react";
import { Link } from "react-router-dom";
import { copyOutline, linkOutline, ellipsisVertical, openOutline, refresh, shareOutline } from "ionicons/icons";
import React, { useState } from "react";
import { ReactComponent as Logo } from "../images/logo.svg";
import TextTVSearchBar from "./TextTVSearchBar";

const Header = props => {
  const {
    history,
    headerStyle,
    onShare,
    handleRefreshBtnClick,
    onCopyTextToClipboard,
    onCopyLinkToClipboard,
    onOpenLinkInBrowser,
    editFavoritesButton
  } = props;

  // const backButtonDefaultHref = `/${match.params.tab}`;
  const backButtonDefaultHref = `/hem?default`;
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState();
  const [actionPerformedToastOpened, setActionPerformedToastOpened] = useState(
    false
  );
  const [actionPerformedMessage, setActionPerformedMessage] = useState("");

  // Visa endast share-knappen om denna variabel är true.
  // Vi sätter den till false för t.ex. chrome desktop där web share inte finns ännu.
  let showShare = true;

  // Om desktop kolla om web share stöds.
  if (isPlatform("desktop") && navigator.share === undefined) {
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
        <IonToolbar color="primary" className="texttv-hide-smallest-screens">
          <IonTitle className="texttv-header-title">
            <Link to="/hem" className="texttv-header-title-link">
              <Logo className="texttv-logo" />
              TextTV.nu
            </Link>
          </IonTitle>
        </IonToolbar>

        <IonToolbar mode="md">
          <IonButtons slot="start">{backButton}</IonButtons>

          <TextTVSearchBar history={history} />

          <IonButtons slot="end">
            <IonButton fill="clear" slot="end" onClick={handleRefreshBtnClick}>
              <IonIcon slot="icon-only" icon={refresh} xmode="md" />
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
              <IonIcon slot="icon-only" icon={ellipsisVertical} xmode="md" />
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
            <IonIcon slot="start" icon={copyOutline}  />
            <IonLabel>Kopiera text</IonLabel>
          </IonItem>
          <IonItem button onClick={handleCopyLinkToClipboard}>
            <IonIcon slot="start" icon={linkOutline}  />
            <IonLabel>Kopiera länk</IonLabel>
          </IonItem>
          <IonItem button onClick={handleOpenLink}>
            <IonIcon slot="start" icon={openOutline}  />
            <IonLabel>Öppna i webbläsare</IonLabel>
          </IonItem>
          {showShare && (
            <IonItem button onClick={handleShareClick}>
              <IonIcon slot="start" icon={shareOutline}  />
              <IonLabel>Dela...</IonLabel>
            </IonItem>
          )}
          {editFavoritesButton}
        </IonList>
      </IonPopover>

      <IonToast
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
