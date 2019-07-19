import { IonContent, IonToolbar } from "@ionic/react";
import React, { useState, useContext, useEffect } from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSearchBar from "../modules/TextTVSearchBar";
import TextTVSidorLista from "../modules/TextTVSidorLista";
import TabContext from "../TabContext";
import { getAndSetIonPageContentAndIonPageScrollElement } from "../functions";

export default props => {
  const { history } = props;
  const tabsinfo = useContext(TabContext);
  const tabsinfoSidor = tabsinfo.tabs.sidor;
  const [ionPageContent, setIonPageContent] = useState();
  const [ionPageScrollElement, setIonPageScrollElement] = useState();

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = `Sidor - Genvägar till vanliga text-tv-sidor`;
  }, [tabsinfoSidor]);

  /**
   * Hämta och sätt ion page content och dess scroll element.
   * Behövs bara göras vid mount.
   */
  useEffect(() => {
    getAndSetIonPageContentAndIonPageScrollElement(
      setIonPageContent,
      setIonPageScrollElement
    );
  }, []);

  // Scrolla till toppen om vi klickar på denna sidan tab igen.
  useEffect(() => {
    ionPageScrollElement && ionPageContent.scrollToTop(500);
  }, [ionPageScrollElement, ionPageContent, tabsinfoSidor]);

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
