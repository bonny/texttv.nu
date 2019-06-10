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
  const { size, pageNum, button, history, refreshTime } = props;

  return (
    <>
      <TextTvPage
        pageNum={pageNum}
        button={button}
        history={history}
        refreshTime={refreshTime}
      >
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
  const { refreshTime } = props;
  return <TextTVCard {...props} size="large" refreshTime={refreshTime} />;
};

export const TextTVThumbnailCard = props => {
  const { refreshTime } = props;
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
      refreshTime={refreshTime}
    />
  );
};
