import { IonRefresher, IonRefresherContent } from "@ionic/react";

const TextTVRefresher = (props) => {
  const { handlePullToRefresh } = props;
  return (
    <IonRefresher slot="fixed" onIonRefresh={handlePullToRefresh}>
      <IonRefresherContent
        pullingText="Dra och släpp för att ladda om"
        refreshingText="Laddar om…"
      />
    </IonRefresher>
  );
};

export default TextTVRefresher;
