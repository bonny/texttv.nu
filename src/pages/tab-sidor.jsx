import { IonPage, IonContent, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import { TabContext } from "../contexts/TabContext";
import {
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm
} from "../functions";
import MenuItems from "../modules/MenuItems";

export default props => {
  const { history } = props;
  const tabsinfo = useContext(TabContext);
  const tabsinfoSidor = tabsinfo.tabs.sidor;

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Sidor - Genvägar till vanliga text-tv-sidor`;
  }, [tabsinfoSidor]);

  // Scrolla till toppen om vi klickar på denna sidans tab igen.
  useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    const ionPageScrollElement = getCurrentIonPageScrollElm();
    ionPageScrollElement && ionPageContent.scrollToTop(500);
  }, [tabsinfoSidor]);

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
