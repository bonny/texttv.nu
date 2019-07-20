import { IonContent, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import TextTVSidorLista from "../modules/TextTVSidorLista";
import TabContext from "../TabContext";
import {
  getCurrentIonPageContentElm,
  getCurrentIonPageScrollElm
} from "../functions";

export default props => {
  const { history } = props;
  const tabsinfo = useContext(TabContext);
  const tabsinfoSidor = tabsinfo.tabs.sidor;

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Sidor - Genvägar till vanliga text-tv-sidor`;
  }, [tabsinfoSidor]);

  // Scrolla till toppen om vi klickar på denna sidan tab igen.
  useEffect(() => {
    const ionPageContent = getCurrentIonPageContentElm();
    const ionPageScrollElement = getCurrentIonPageScrollElm();
    ionPageScrollElement && ionPageContent.scrollToTop(500);
  }, [tabsinfoSidor]);

  return (
    <>
      <TextTVHeader title="Sidor">
        <IonToolbar color="dark">
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
