import React, { useState } from "react";
import { IonReactRouter } from "@ionic/react-router";
// import { Capacitor } from "@capacitor/core";
import { Plugins } from "@capacitor/core";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
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
import TabPopulart from "./pages/tab-mest-last";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import "./theme.css";
import TabContext from "./TabContext";
import { getUnixtime } from "./functions";

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

  /**
   * När en tab klickas på så sätter vi tidpunkt för klicket
   * i state tabsinfo. Denna info används sedan i context TabContext
   *
   */
  const handleTabClick = e => {
    const target = e.currentTarget;
    const tab = target.getAttribute("tab");
    const cacheBustTimeString = getCacheBustTimeString(2);
    const timestamp = getUnixtime();

    // Determine new and old tab.
    const isNewTab = tabsinfo.lastClicked.name !== tab;

    setTabsinfo({
      ...tabsinfo,
      isNewTab: isNewTab,
      isSameTab: !isNewTab,
      lastClicked: {
        name: tab,
        time: timestamp,
        timeCacheBusterString: cacheBustTimeString
      },
      prevClicked: {
        name: tabsinfo.lastClicked.name,
        time: tabsinfo.lastClicked.time
      },
      tabs: {
        ...tabsinfo.tabs,
        [tab]: {
          mame: tab,
          lastClickedTime: timestamp,
          lastClickedTimeCacheBusterString: cacheBustTimeString,
          isNewTab: isNewTab
        }
      }
    });
  };

  const detfaultTabinfoState = {
    lastClicked: {
      name: null,
      time: null
    },
    prevClicked: {
      name: null,
      time: null
    },
    isNewTab: undefined,
    isSameTab: undefined,
    tabs: {
      hem: {},
      sidor: {},
      nyast: {},
      populart: {}
    }
  };

  const [tabsinfo, setTabsinfo] = useState(detfaultTabinfoState);

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
                      return <Startsida {...props} />;
                    }}
                    exact={true}
                  />
                  <Route path="/:tab(hem)/:pageNum" component={PageTextTV} />

                  <Route
                    path="/:tab(arkiv)"
                    component={TabPopulart}
                    exact={true}
                  />
                  <Route
                    path="/:tab(arkiv)/:pageNum"
                    component={PageTextTV}
                    exact={true}
                  />
                  <Route
                    path="/:tab(arkiv)/:pageNum/:pageId/"
                    component={PageTextTV}
                    exact={true}
                  />

                  <Route
                    path="/:tab(sidor)"
                    component={TabSidor}
                    exact={true}
                  />
                  <Route path="/:tab(sidor)/:pageNum" component={PageTextTV} />

                  <Route
                    path="/:tab(nyast)"
                    component={TabNyast}
                    exact={true}
                  />
                  <Route path="/:tab(nyast)/:pageNum" component={PageTextTV} />

                  {/* 
                  Fallback för url som är sidnummer direkt, t.ex. "/100".
                  Bra om man t.ex. hijackar url och skriver sida där manuellt.
                  */}
                  <Route
                    path="/:pageNum([0-9]{3}.*)"
                    component={PageCatchAll}
                  />

                  {/* From docs example */}
                  <Route
                    path="/:tab(sessions)"
                    // component={SessionsPage}
                    exact={true}
                  />
                  <Route
                    path="/:tab(sessions)/:id"
                    // component={SessionDetail}
                  />
                  <Route
                    path="/:tab(speakers)"
                    // component={SpeakerList}
                    exact={true}
                  />
                  {/* // From docs example */}
                  {/* 
                   If the navigated URL were "/sessions", it would match the first route and add a URL parameter named "tab" with the value of "sessions" to the resulting match object passed into SessionsPage.

                    When a user navigates to a session detail page ("/sessions/1" for instance), the second route adds a URL parameter named "tab" with a value of "sessions". When IonRouterOutlet sees that both pages are in the same "sessions" tab, it provides an animated page transition to the new view. If a user navigates to a new tab ("speakers" in this case), IonRouterOutlet knows not to provide the animation
                   */}

                  {/* <Route path="/:pageNum([0-9]{3}-[0-9]{3})+" component={PageCatchAll} /> */}
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
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
                    href="/arkiv"
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
