import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/react";
import { document, analytics, informationCircleOutline } from "ionicons/icons";
import { navItems, navItemsAlsoLike } from "./navItems";
import TextTVSidorLista from "./TextTVSidorLista";
import { useState, useEffect } from "react";
import { getStats } from "../functions";

// Helper function to get most visited pages
const getMostVisitedPages = (pages = {}, limit = 10) => {
  return Object.entries(pages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([pageNum, count]) => ({
      pageNum,
      count,
    }));
};

const MenuItem = ({ item }) => {
  const icon = item.icon ? item.icon : document;
  return (
    <IonItem href={item.href} rel="external" target="_blank">
      <IonIcon slot="start" icon={icon} />
      <IonLabel>{item.title}</IonLabel>
    </IonItem>
  );
};

// Component to display most visited pages
const MostVisitedPages = ({ pages }) => {
  const mostVisited = getMostVisitedPages(pages);

  return (
    <IonItem>
      <IonIcon slot="start" icon={document} />
      <IonLabel>
        <h2>Dina mest besökta sidor</h2>
        {mostVisited.map(({ pageNum, count }) => (
          <p key={pageNum}>
            Sida {pageNum}: {count} besök
          </p>
        ))}
      </IonLabel>
    </IonItem>
  );
};

// Component to display app statistics
const AppStatistics = ({ custom }) => {
  return (
    <IonItem>
      <IonIcon slot="start" icon={analytics} />
      <IonLabel>
        <h2>App-statistik</h2>
        <p>Antal app-starter: {custom?.appStart || 0}</p>
        <p>Antal app-återupptagningar: {custom?.appResume || 0}</p>
      </IonLabel>
    </IonItem>
  );
};

const MenuItems = (props) => {
  const [statsData, setStatsData] = useState({ pages: {}, custom: {} });

  // Fetch stats data using getStats function
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getStats();
        setStatsData(stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <TextTVSidorLista {...props} showHeader={false} />

      <IonList>
        <IonListHeader>
          <IonLabel>Statistik</IonLabel>
        </IonListHeader>
        <MostVisitedPages pages={statsData.pages} />
        <AppStatistics custom={statsData.custom} />
      </IonList>

      <IonList>
        <IonItem routerLink="/statistik">
          <IonIcon slot="start" icon={analytics} />
          <IonLabel>Statistik</IonLabel>
        </IonItem>
        <IonItem routerLink="/kontakta-oss">
          <IonIcon slot="start" icon={informationCircleOutline} />
          <IonLabel>Kontakta oss</IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Externa länkar om texttv.nu</IonLabel>
        </IonListHeader>
        {navItems.map((item) => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>

      <IonList>
        <IonListHeader>
          <IonLabel>Vi på TextTV.nu gillar också</IonLabel>
        </IonListHeader>

        {navItemsAlsoLike.map((item) => {
          return <MenuItem item={item} key={item.href} />;
        })}

        <IonItem routerLink="/debug" style={{ opacity: 0 }}>
          <IonIcon slot="start" icon={document} />
          <IonLabel>Debug</IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default MenuItems;
