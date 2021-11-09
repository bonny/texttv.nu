import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
} from "@ionic/react";
import { TextTVHeader } from "../modules/TextTVHeader";

function PageKontaktaOss(props) {
  return (
    <IonPage>
      <TextTVHeader {...props} title="Kontakta oss"></TextTVHeader>

      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Kontaktinformation</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Hej!</p>
            <p>
              Jag som utvecklar denna app och tjänst heter Pär Thernström och du
              kan nå mig på{" "}
              <a href="mailto:par.thernstrom@gmail.com">
                par.thernstrom@gmail.com
              </a>
              .
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export { PageKontaktaOss };
