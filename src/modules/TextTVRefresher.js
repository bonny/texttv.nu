import { IonRefresher, IonRefresherContent } from "@ionic/react";
import { reloadOutline } from "ionicons/icons";

const TextTVRefresher = (props) => {
  const { handlePullToRefresh } = props;
  return (
    <IonRefresher slot="fixed" onIonRefresh={handlePullToRefresh}>
      <IonRefresherContent
        // refreshingSpinner="lines-small"
        pullingText="Dra och släpp för att ladda om"
        refreshingText="Laddar om…"
        pullingIcon={reloadOutline}
      />
    </IonRefresher>
  );
};

export default TextTVRefresher;
