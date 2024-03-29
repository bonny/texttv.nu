import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route, useLocation } from "react-router-dom";
import { PageKontaktaOss } from "../pages/kontaktaOss.js";
import { Page404 } from "../pages/page-404.js";
import PageTextTV from "../pages/page-TextTV.js";
import PageCatchAll from "../pages/PageCatchAll";
import { PageDebug } from "../pages/pageDebug.js";
import { PageStatistik } from "../pages/statistik.js";
import { TabPopulart } from "../pages/tab-mest-last";
import { TabNyast } from "../pages/tab-nyast";
import { TabSidor } from "../pages/tab-sidor";
import { Startsida } from "../pages/tab-startsida";
import { PageTestSkeleton } from "../pages/tabTestSkeleton";
import { PageTestTextTVSida } from "../pages/tabTestTextTVSida";
import { tabButtons } from "./tabButtons";

export const Navigationsflikar = () => {
  const location = useLocation();

  return (
    <IonTabs id="mainContent">
      <IonRouterOutlet id="routerOutletElm" animated={false}>
        {/* 404-sida */}
        <Route path="*" component={Page404} />

        <Route exact path="/" render={() => <Redirect to="/hem" />} />
        {/* Diverse testsidor/testsökvägar. */}
        <Route path="/debug" component={PageDebug} />
        <Route path="/statistik" component={PageStatistik} />
        <Route path="/kontakta-oss" component={PageKontaktaOss} />
        <Route path="/test/skeleton" component={PageTestSkeleton} />
        <Route path="/test/texttvsida" component={PageTestTextTVSida} />
        <Route
          path="/test/texttvsida/:urlPageNum"
          component={PageTestTextTVSida}
        />

        <Route path="/hem/:pageNum" component={PageTextTV} exact={true} />
        <Route path="/hem" component={Startsida} exact={true} />

        <Route
          path="/arkiv/:pageNum/:pageId/"
          component={PageTextTV}
          exact={true}
        />
        <Route path="/arkiv/:pageNum" component={PageTextTV} exact={true} />
        <Route path="/arkiv" component={TabPopulart} exact={true} />

        <Route path="/sidor/:pageNum" component={PageTextTV} exact={true} />
        <Route path="/sidor" component={TabSidor} exact={true} />

        <Route path="/nyast/:pageNum" component={PageTextTV} exact={true} />
        <Route path="/nyast" component={TabNyast} exact={true} />

        {/*
            Fallback för url som är sidnummer direkt, t.ex. "/100".
            Bra om man t.ex. hijackar url och skriver sida där manuellt.
            */}
        <Route path="/:pageNum([0-9]{3}.*/?)" component={PageCatchAll} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {tabButtons.map((tabBtnProps) => {
          const { tab, className, href, icon, iconSelected, title } =
            tabBtnProps;

          // Sätt ikon baserat på om fliken är vald eller inte.
          const isSelected = location.pathname.startsWith(href);
          const tabIcon = isSelected ? iconSelected : icon;

          return (
            <IonTabButton
              href={href}
              key={`${tab}`}
              tab={`${tab}`}
              className={className}
              selected={isSelected}
            >
              <IonIcon icon={tabIcon} />
              <IonLabel>{title}</IonLabel>
            </IonTabButton>
          );
        })}
      </IonTabBar>
    </IonTabs>
  );
};
