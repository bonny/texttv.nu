import {
  IonButton,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonActionSheet
} from "@ionic/react";
import fitty from "fitty";
import React, { useEffect, useState } from "react";
import { TextTvPage } from "./texttv-page.js";

export const TextTVCard = props => {
  const { size, pageNum } = props;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Title yo`;

    // https://github.com/rikschennink/fitty
    fitty(".TextTVPage__inner", {
      minSize: 2,
      maxSize: 18
    });
  }, [pageNum]);

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

      <IonCard {...props} onClick={props.onCardClick}>
        <TextTvPage />

        {size === "large" && (
          <IonItem lines="none">
            <IonLabel>
              <p>Uppdaterad idag 10.23</p>
            </IonLabel>
            <IonButton fill="clear" slot="end" onClick={handleMoreActionsClick}>
              <IonIcon slot="icon-only" name="more" />
            </IonButton>
          </IonItem>
        )}

        {size === "thumbnail" && (
          <IonItem lines="none" detail>
            <IonLabel>
              <h3>101-103</h3>
            </IonLabel>
          </IonItem>
        )}
      </IonCard>
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
      button={true}
      onCardClick={handleCardClick}
    />
  );
};
