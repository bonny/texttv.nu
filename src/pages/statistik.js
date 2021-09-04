import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonList,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonListHeader,
  IonRouterLink,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getStats } from "../functions";
import { TextTVHeader } from "../modules/TextTVHeader";
import { Link } from "react-router-dom";

function PageStatistik(props) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function get() {
      setStats(await getStats());
    }

    get();
  }, []);

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
            <IonCardTitle>Sidor</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sida</th>
                  <th style={thStyle}>Visningar</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map(([pageNum, count]) => {
                  const link = `sidor/${pageNum}`;
                  return (
                    <tr>
                      <td style={tdStyle}>
                        <IonRouterLink routerLink={link} color="light">
                          {pageNum}
                        </IonRouterLink>
                      </td>
                      <td style={tdStyle}>{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>App</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tdStyle}>
                    <IonText color="light">Start</IonText>
                  </td>
                  <td style={tdStyle}>{numAppStarts}</td>
                </tr>

                <tr>
                  <td style={tdStyle}>
                    <IonText color="light">Återupptagning</IonText>
                  </td>
                  <td style={tdStyle}>{numAppResume}</td>
                </tr>
              </tbody>
            </table>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export { PageStatistik };
