import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route, useHistory, useLocation } from "react-router-dom";
import { Page404 } from "../pages/page-404.js";
import PageTextTV from "../pages/page-TextTV.js";
import PageCatchAll from "../pages/PageCatchAll";
import { PageDebug } from "../pages/pageDebug.js";
import { TabPopulart } from "../pages/tab-mest-last";
import { TabNyast } from "../pages/tab-nyast";
import { TabSidor } from "../pages/tab-sidor";
import { Startsida } from "../pages/tab-startsida";
import { tabButtons } from "./tabButtons";

export const Navigationsflikar = () => {
  const history = useHistory();
  const location = useLocation();

  // Click fungerar ej pga:
  // https://github.com/ionic-team/ionic-framework/issues/22511
  // https://github.com/ionic-team/ionic-framework/issues/17761
  // så därför använder vi mouseup.
  const handleTabMouseUp = (e) => {
    const tabButton = e.target.closest("ion-tab-button");
    const tabHref = tabButton.getAttribute("data-href");
    history.push(tabHref);
  };

  return (
    <IonTabs id="mainContent">
      <IonRouterOutlet id="routerOutletElm" animated={false}>
        {/* Diverse testsidor/testsökvägar. */}
        <Route path="/debug" component={PageDebug} />

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

        {/* 404-sida */}
        <Route component={Page404} />
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
              // onClick fungerar inte pga bugg i ionic (se handleClick)
              onMouseUp={handleTabMouseUp}
              // href={href}
              data-href={href}
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
