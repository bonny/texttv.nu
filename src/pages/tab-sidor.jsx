import { IonContent, IonPage, IonToolbar } from "@ionic/react";
import React, { useEffect } from "react";
import MenuItems from "../modules/MenuItems";
import { TextTVHeader } from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";

const TabSidor = (props) => {
  const { history } = props;

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Sidor - Genvägar till vanliga text-tv-sidor`;
  }, []);

  // Scrolla till toppen om vi klickar på denna sidans tab igen.
  /*   useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    const ionPageScrollElement = getCurrentIonPageScrollElm();
    ionPageScrollElement && ionPageContent.scrollToTop(500);
  }, [tabsinfoSidor]);
 */
  return (
    <IonPage>
      <TextTVHeader title="Sidor">
        <IonToolbar mode="md">
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent>
        {/* <TextTVSidorLista {...props} showHeader={false} /> */}
        <MenuItems {...props} />
      </IonContent>
    </IonPage>
  );
};

export { TabSidor };
