import React, { useState, useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
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
  IonTabs
} from "@ionic/react";
import { clock, eye, home, listBox } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import "./App.css";
import { getCacheBustTimeString } from "./functions";
import { MenuWithRouter } from "./modules/SideMenu";
import PageTextTV from "./pages/page-TextTV.js";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-mest-last";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import "./theme.css";
import TabContext from "./TabContext";
import { getUnixtime } from "./functions";
import { Analytics } from "capacitor-analytics";
import PageCatchAll from "./PageCatchAll";

const { SplashScreen } = Plugins;
const { AdMob } = Plugins;
const analytics = new Analytics();

try {
  AdMob.initialize("ca-app-pub-1689239266452655~1859283602");
} catch (e) {
  console.log("got error when trying to init admob", e);
}

SplashScreen.hide();

function App(props) {
  /**
   * När en tab klickas på så sätter vi tidpunkt för klicket
   * i state tabsinfo. Denna info används sedan i context TabContext
   */
  const handleTabClick = e => {
    const target = e.currentTarget;

    // "tab-button-nyast", "tab-button-sidor", ...
    const tab = target.getAttribute("id").replace("tab-button-", "");
    const cacheBustTimeString = getCacheBustTimeString(2);
    const timestamp = getUnixtime();
    const isNewTab = tabsinfo.lastClicked.name !== tab;

    // Skicka statistik när man går till ny flik.
    if (isNewTab) {
      try {
        analytics.setScreen({
          name: tab
        });
      } catch (e) {}
    }

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
          name: tab,
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

  const adMobAdOptions = {
    // TODO: use real AD-id
    //adId: "ca-app-pub-1689239266452655/3336016805",

    // google test ad
    // https://developers.google.com/admob/android/test-ads#sample_ad_units
    adId: "ca-app-pub-3940256099942544/6300978111",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    hasTabBar: true, // make it true if you have TabBar Layout.
    tabBarHeight: 56, // you can assign custom margin in pixel default is 56
    margin: 60
  };

  useEffect(() => {
    console.log("useEffect admob show banner");
    try {
      AdMob.showBanner(adMobAdOptions).then(
        value => {
          console.log("admob show banner ok", value); // true
        },
        error => {
          console.error("admob show banner error", error); // show error
        }
      );

      // Subscibe Banner Event Listener
      AdMob.addListener("onAdLoaded", info => {
        console.log("Banner Ad Loaded", info);
      });
    } catch (e) {
      console.log("admob got error when trying to show banner");
    }
  }, [adMobAdOptions]);

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
