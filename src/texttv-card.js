import {
  IonActionSheet,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel
} from "@ionic/react";
// import fitty from "fitty";
import React, { useState } from "react";
import { TextTvPage } from "./texttv-page.js";
import Moment from "react-moment";
import "moment/locale/sv";

export const TextTVCard = props => {
  const { size, pageNum, button } = props;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);

  const handleMoreActionsClick = e => {
    console.log("handleMoreActionsClick", e);
    setActionSheetOpened(true);
  };

  return (
    <>
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

      <TextTvPage pageNum={pageNum} button={button}>
        {size === "large" && (
          <IonItem lines="none">
            <IonLabel>
              <p>Uppdaterad idag 10.23. @TODO: få tag i sidans tid här</p>
              {/* <Moment unix format="HH:mm" locale="sv">
                {page.date_added_unix}
              </Moment>{" "} */}
            </IonLabel>
            <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
              <IonIcon slot="icon-only" name="more" />
            </IonButton>
          </IonItem>
        )}

        {size === "thumbnail" && (
          <IonItem lines="none" button={button}>
            <IonLabel>
              <h3>{pageNum}</h3>
            </IonLabel>
          </IonItem>
        )}
      </TextTvPage>
    </>
  );
};

export const TextTVLargeCard = props => {
  return <TextTVCard {...props} size="large" />;
};

export const TextTVThumbnailCard = props => {
  const handleCardClick = e => {
    e.preventDefault();
    console.log("handle click", e);
  };
  return (
    <TextTVCard
      {...props}
      size="thumbnail"
      button
      onCardClick={handleCardClick}
    />
  );
};
