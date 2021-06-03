import {
  IonContent,
  IonPage,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useEffect } from "react";
import MenuItems from "../modules/MenuItems";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import { BackButton } from "../modules/BackButton";

const TabSidor = (props) => {
  const { history } = props;

  // Uppdatera dokument-titel när komponenten/sidan visas.
  useEffect(() => {
    document.title = `Sidor - Genvägar till vanliga text-tv-sidor`;
  }, []);

  return (
    <IonPage>
      <TextTVHeader title="Sidor">
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <BackButton history={history} />
          </IonButtons>
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent>
        <MenuItems {...props} />
      </IonContent>
    </IonPage>
  );
};

export { TabSidor };
