import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  NavContext,
} from "@ionic/react";
import {
  eye,
  eyeOutline,
  home,
  homeOutline,
  list,
  listOutline,
  time,
  timeOutline,
} from "ionicons/icons";
import React, { useContext } from "react";
import { Route } from "react-router-dom";
import PageTextTV from "../pages/page-TextTV.js";
import PageCatchAll from "../pages/PageCatchAll";
import { PageDebug } from "../pages/pageDebug.js";
import { PageTest, PageTestar, PageTestarUndersida } from "../pages/PageTest";
import TabPopulart from "../pages/tab-mest-last";
import TabNyast from "../pages/tab-nyast";
import TabSidor from "../pages/tab-sidor";
import Startsida from "../pages/tab-startsida";

export const Navigationsflikar = () => {
  const navContext = useContext(NavContext);
  const routeInfo = navContext.routeInfo;

  const tabButtons = [
    {
      tab: "hem",
      title: "Hem",
      icon: homeOutline,
      iconSelected: home,
      href: "/hem",
    },
    {
      tab: "sidor",
      title: "sidor",
      icon: listOutline,
      iconSelected: list,
      href: "/sidor",
      className: "ion-hide-lg-up",
    },
    {
      tab: "nyast",
      title: "Nyast",
      icon: timeOutline,
      iconSelected: time,
      href: "/nyast",
    },
    {
      tab: "populart",
      title: "Mest läst",
      icon: eyeOutline,
      iconSelected: eye,
      href: "/arkiv",
    },
  ];

  return (
    <IonTabs id="mainContent">
      {/* kan id vara här för IonSplitPane? id="mainContent" */}
      <IonRouterOutlet id="routerOutletElm" animated={false}>
        {/* Diverse testsidor/testsökvägar. */}
        <Route path="/debug" component={PageDebug} />
        <Route path="/test" component={PageTest} />
        <Route path="/testar" component={PageTestar} exact={true} />
        <Route
          path="/testar/undersida/:undersida/"
          component={PageTestarUndersida}
        />

        <Route path="/hem" component={Startsida} exact={true} />
        <Route path="/hem/:pageNum" component={PageTextTV} />

        <Route path="/arkiv" component={TabPopulart} exact={true} />
        <Route path="/arkiv/:pageNum" component={PageTextTV} exact={true} />
        <Route
          path="/arkiv/:pageNum/:pageId/"
          component={PageTextTV}
          exact={true}
        />

        <Route path="/sidor" component={TabSidor} exact={true} />
        <Route path="/sidor/:pageNum" component={PageTextTV} />

        <Route path="/nyast" component={TabNyast} exact={true} />
        <Route path="/nyast/:pageNum" component={PageTextTV} />

        {/*
            Fallback för url som är sidnummer direkt, t.ex. "/100".
            Bra om man t.ex. hijackar url och skriver sida där manuellt.
            */}
        <Route path="/:pageNum([0-9]{3}.*)" component={PageCatchAll} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {tabButtons.map((tabBtnProps) => {
          const {
            tab,
            className,
            href,
            icon,
            iconSelected,
            title,
          } = tabBtnProps;

          // Sätt ikon baserat på om fliken är vald eller inte.
          const isSelected = routeInfo.pathname.startsWith(href);
          const tabIcon = isSelected ? iconSelected : icon;

          return (
            <IonTabButton key={tab} tab={tab} href={href} className={className}>
              <IonIcon icon={tabIcon} />
              <IonLabel>{title}</IonLabel>
            </IonTabButton>
          );
        })}
      </IonTabBar>
    </IonTabs>
  );
};
