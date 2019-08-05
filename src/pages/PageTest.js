import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from "@ionic/react";
import { close, refresh } from "ionicons/icons";
import React, { useState } from "react";
import TextTVPage from "../modules/TextTVPage";

export const PageTest = props => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = props => {
    setIsOpen(true);
  };
  return (
    <IonContent>
      <IonButton onClick={handleClick}>Toast</IonButton>
      <IonToast
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        message="En uppdatering av sidan finns"
        position="bottom"
        duration="3000"
        translucent={true}
        buttons={[
          {
            side: "end",
            icon: refresh,
            text: "Ladda om",
            role: "primary",
            handler: () => {
              console.log("Favorite clicked");
            }
          },
          {
            side: "end",
            icon: close,
            text: "",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          }
        ]}
      />
      <TextTVPage pageNum="100-103" />
    </IonContent>
  );
};

export const PageTestar = props => {
  console.log("PageTestar");
  console.log(props);
  const { history } = props;
  const { undersida } = props.match.params;

  const handleGoClick = props => {
    history.push(`/testar/undersida/1`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/testar/defaultHref" />
          </IonButtons>
          <IonTitle>Testsida, undersida: {undersida}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent padding>
        <h1>Content</h1>
        <p>Undersida: {undersida}</p>
        <IonButton size="large" onClick={handleGoClick}>
          Gå
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export const PageTestarUndersida = props => {
  console.log("PageTestarUndersida");
  console.log(props);
  const { history } = props;
  let { undersida } = props.match.params;
  undersida = parseInt(undersida);

  const handleGoClick = props => {
    history.push(`/testar/undersida/${++undersida}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/testar/defaultHref" />
          </IonButtons>
          <IonTitle>Undersida, undersida: {undersida}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent padding>
        <h1>Content undersida</h1>
        <p>Undersida: {undersida}</p>
        <IonButton size="large" onClick={handleGoClick}>
          Gå
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
