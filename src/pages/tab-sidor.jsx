import React from "react";
import {
  IonContent,
  IonToolbar,
  IonSearchbar,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonLabel
  
} from "@ionic/react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSidorLista from "../modules/TextTVSidorLista";

export default props => {
  const { history } = props;

  const handlePageNumInputChange = e => {
    const pageNum = e.target.value;
    if (pageNum.length === 3) {
      history.push(`/sida/${pageNum}`);
      e.target.value = "";
      document.querySelector("ion-menu-controller").close();
    }
  };

  const OneItem = (props) => {
    const {lines = 'inset', title, pages} = props;
    const url = `/sida/${pages}`;
    return (
      <IonItem
      button
      detail
      onClick={() => {
        document.querySelector("ion-menu-controller").close();
        history.push(url);
      }}
      lines={lines}
      color="dark"
    >
      <IonLabel text-wrap>
        <h2 className="ListHeadlineSidor">{title}</h2>
        <p>{pages}</p>
      </IonLabel>
    </IonItem>
    )};

    const OneHeadlineItem = (props) => {
      const itemStyles = {
        color: 'var(--text-tv-color-cyan)',
      }
      const {title} = props;
      return (
        <IonCol size="12">
        <IonItem lines="none" style={itemStyles}>
<IonLabel>{title}</IonLabel>
</IonItem>
        </IonCol>

      );
    }

  return (
    <>
      <TextTVHeader title="Sidor">
        <IonToolbar color="primary">
          <IonSearchbar
            color="primary"
            placeholder='Gå till "100", "200", "377" …'
            onIonChange={handlePageNumInputChange}
            showCancelButton={false}
            clearIcon={false}
            type="number"
            // searchIcon="document"
          />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">

        <IonGrid no-padding>

        <IonRow>
        <OneHeadlineItem title="Start"/>
            <IonCol size="6"><OneItem title="Nyheter" pages="100" /></IonCol>
            <IonCol size="6"><OneItem title="Översikt" pages="700" /></IonCol>
          </IonRow>

          <IonRow>
            <OneHeadlineItem title="Nyheter"/>
            <IonCol size="6"><OneItem title="Inrikes" pages="101-103" /></IonCol>
            <IonCol size="6"><OneItem title="Utrikes" pages="104-105" /></IonCol>
          </IonRow>

          <IonRow>

          <OneHeadlineItem title="Sport"/>
                      <IonCol size="6"><OneItem title="Nyheter" pages="300-302" /></IonCol>
            <IonCol size="6"><OneItem title="Resultatbörs" pages="330" /></IonCol>
            <IonCol size="6"><OneItem title="Målservice" pages="376-395" /></IonCol>
            <IonCol size="6"><OneItem title="Sport i SVT" pages="379" /></IonCol>
          </IonRow>
          <IonRow>
          <OneHeadlineItem title="Ekonomi"/>

            <IonCol size="6"><OneItem title="Innehåll" pages="200-201" /></IonCol>
            <IonCol size="6"><OneItem title="Börsen" pages="202" /></IonCol>
          </IonRow>
          <IonRow>
          <OneHeadlineItem title="TV"/>

            <IonCol size="6"><OneItem title="Tablåer" pages="600" /></IonCol>
            <IonCol size="6"><OneItem title="Programguiden" pages="650" /></IonCol>
            <IonCol size="6"><OneItem title="Dagens programsidor" pages="624" /></IonCol>
          </IonRow>
        </IonGrid>

        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
