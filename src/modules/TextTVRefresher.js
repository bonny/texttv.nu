import { IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";

const TextTVRefresher = props => {
  const { handlePullToRefresh } = props;
  return (
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
  );
};

export default TextTVRefresher;
