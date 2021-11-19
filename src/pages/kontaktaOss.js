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
              </a>{" "}
              eller telefon{" "}
              <span className="ion-text-nowrap">070-225 14 91</span>.
            </p>
            <p>
              Läs mer{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://texttv.nu/sida/om-texttv-nu"
              >
                om TextTV.nu
              </a>{" "}
              på vår hemsida.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export { PageKontaktaOss };
