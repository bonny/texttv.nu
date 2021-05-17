import { IonContent, IonPage } from "@ionic/react";
import Header from "../modules/Header";

const Page404 = () => {
  return (
    <IonPage>
      <Header></Header>
      <IonContent className="ion-padding">
        <p>Ajdå, den här sidan fanns visst inte.</p>
      </IonContent>
    </IonPage>
  );
};

export { Page404 };
