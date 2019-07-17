import React, { useState } from "react";
// import { Capacitor } from "@capacitor/core";
import { Plugins } from "@capacitor/core";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonReactRouter,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs // IonCard,
} from "@ionic/react";
import { clock, eye, home, listBox } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import "./App.css";
import { getPageRangeInfo, getCacheBustTimeString } from "./functions";
import { MenuWithRouter } from "./Menu";
import PageTextTV from "./pages/page-TextTV.js";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-populart";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import "./theme.css";
import TabContext from "./TabContext";

const { SplashScreen } = Plugins;

SplashScreen.hide();

/**
 * Komponent som alltid renderas, i.e. catch all component i React Router.
 * Används för att visa sidor /100 /100,101, /100-104,377 osv, dvs utan "sida"-prefix
 *
 * @param object props
 */
const PageCatchAll = props => {
  const { pageNum } = props.match.params;
  const pageRangeInfo = getPageRangeInfo(pageNum);
  console.log("PageCatchAll", pageNum);

  if (pageRangeInfo.allValid) {
    // Skicka vidare till sida
    return <Redirect to={`/sidor/${pageNum}`} />;
  } else {
    return null;
  }
};

function App(props) {
  // const [currentTab, setCurrentTab] = useState("hem");
  // const [prevTab, setPrevTab] = useState();

  // const handleTabsDidChange = e => {
  //   // setPrevTab(currentTab);
  //   // setCurrentTab(e.currentTarget.selectedTab);
  // };

  const handleTabClick = e => {
    const target = e.currentTarget;
    const tab = target.getAttribute("tab");
    const cacheBustTimeString = getCacheBustTimeString(2);

    setTabsinfo({
      ...tabsinfo,
      lastClickedName: tab,
      lastClickedTime: cacheBustTimeString,
      tabs: {
        ...tabsinfo.tabs,
        [tab]: {
          mame: tab,
          lastClickedTime: cacheBustTimeString
        }
      }
    });
  };

  const [tabsinfo, setTabsinfo] = useState({
    lastClickedTime: null,
    lastClickedName: null,
    tabs: {
      hem: {},
      sidor: {},
      nyast: {},
      populart: {}
    }
  });

  return (
    <TabContext.Provider value={tabsinfo}>
      <IonApp>
        <IonReactRouter>
          <Route exact path="/" render={() => <Redirect to="/hem" />} />
          <IonSplitPane contentId="main">
            <MenuWithRouter {...props} />
            <IonPage id="main">
              <IonTabs>
                <IonRouterOutlet>
                  <Route path="/test" component={PageTest} />
                  <Route path="/testar" component={PageTestar} exact={true} />
                  <Route
                    path="/testar/undersida/:undersida/"
                    component={PageTestarUndersida}
                  />
                  <Route
                    path="/:tab(hem)"
                    render={props => {
                      // console.log("route hem", props);
                      // console.log("route hem tabsinfo", tabsinfo);
                      // TODO: skicka ner clicktiden, inte route rendertid
                      return <Startsida {...props} />;
                    }}
                    exact={true}
                  />
                  <Route
                    path="/:tab(mest-last)"
                    component={TabPopulart}
                    exact={true}
                  />
                  <Route
                    path="/:tab(sidor)"
                    component={TabSidor}
                    exact={true}
                  />
                  <Route
                    path="/:tab(nyast)"
                    component={TabNyast}
                    exact={true}
                  />
                  <Route
                    path="/arkivsida/:pageNum/:pageId/"
                    component={PageTextTV}
                  />
                  <Route path="/sidor/:pageNum" component={PageTextTV} />
                  <Route
                    path="/:pageNum([0-9]{3}.*)"
                    component={PageCatchAll}
                  />
                  {/* <Route path="/:pageNum([0-9]{3}-[0-9]{3})+" component={PageCatchAll} /> */}
                </IonRouterOutlet>

                <IonTabBar slot="bottom" color="dark">
                  <IonTabButton tab="hem" href="/hem" onClick={handleTabClick}>
                    <IonIcon icon={home} mode="md" />
                    <IonLabel>Hem</IonLabel>
                  </IonTabButton>

                  <IonTabButton
                    tab="sidor"
                    href="/sidor"
                    className="ion-hide-lg-up"
                    onClick={handleTabClick}
                  >
                    <IonIcon icon={listBox} mode="md" />
                    <IonLabel>Sidor</IonLabel>
                  </IonTabButton>

                  <IonTabButton
                    tab="nyast"
                    href="/nyast"
                    onClick={handleTabClick}
                  >
                    <IonIcon icon={clock} mode="md" />
                    <IonLabel>Nyast</IonLabel>
                  </IonTabButton>

                  <IonTabButton
                    tab="populart"
                    href="/mest-last"
                    onClick={handleTabClick}
                  >
                    <IonIcon icon={eye} mode="md" />
                    <IonLabel>Mest läst</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonPage>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </TabContext.Provider>
  );
}

export default App;
