import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
  IonRouterLink,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { getStats } from "../functions";
import { TextTVHeader } from "../modules/TextTVHeader";

function PageKontaktaOss(props) {
  const routeMatch = useRouteMatch({ path: "/statistik", exact: true })
    ? true
    : false;
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!routeMatch) {
      return;
    }

    async function get() {
      setStats(await getStats());
    }

    get();
  }, [routeMatch]);

  const numAppStarts = stats?.custom?.appStart || 0;
  const numAppResume = stats?.custom?.appResume || 0;
  const pages = stats?.pages || {};
  const sortedPages = Object.entries(pages).sort(([, v1], [, v2]) => +v2 - +v1);

  const tableStyle = { fontSize: "1.25rem" };
  const tdStyle = { padding: "1rem", border: "1px solid #333" };
  const thStyle = { ...tdStyle, textAlign: "left" };

  return (
    <IonPage>
      <TextTVHeader {...props} title="Statistik"></TextTVHeader>

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
