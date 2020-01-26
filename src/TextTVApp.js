import React, { useState, useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "./App.css";
import "./theme.css";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform
} from "@ionic/react";
import { clock, eye, home, listBox } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import { getCacheBustTimeString, isRunningInWebBrowser } from "./functions";
import { MenuWithRouter } from "./modules/SideMenu";
import PageTextTV from "./pages/page-TextTV.js";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-mest-last";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import { TabContext } from "./contexts/TabContext";
import { FavoritesContext } from "./contexts/FavoritesContext";
import {
  getUnixtime,
  loadFavorites,
  FAVORITES_DEFAULT_PAGES
} from "./functions";
import { Analytics } from "capacitor-analytics";
import PageCatchAll from "./pages/PageCatchAll";

import * as firebase from "firebase/app";
import "firebase/analytics";

const { SplashScreen, AdMob, StatusBar } = Plugins;
const analytics = new Analytics();

if (isRunningInWebBrowser()) {
  const firebaseConfig = {
    apiKey: "AIzaSyD74YswGldkaY4lpbebtHPMD6p26CeFqEk",
    authDomain: "teletext-a4d17.firebaseapp.com",
    databaseURL: "https://teletext-a4d17.firebaseio.com",
    projectId: "teletext-a4d17",
    storageBucket: "teletext-a4d17.appspot.com",
    messagingSenderId: "30223179902",
    appId: "1:30223179902:web:1c9e49796a9a29c30bf82f",
    measurementId: "G-F8Y7QYLTHQ"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

try {
  AdMob.initialize()
    .then(() => {
      // console.log("AdMob init ok");
    })
    .catch(e => {
      // console.log("AdMob init catch", e);
    });
} catch (e) {
  // console.log("got error when trying to init admob", e);
}

SplashScreen.hide();

StatusBar.setStyle({
  style: StatusBarStyle.Dark
});

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

function TextTVApp(props) {
  const [tabsinfo, setTabsinfo] = useState(detfaultTabinfoState);
  const [favorites, setFavorites] = useState(FAVORITES_DEFAULT_PAGES);

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

  // Ladda in favoriter från storage när app startas.
  useEffect(() => {
    async function getFavs() {
      const favoritePages = await loadFavorites();
      setFavorites(favoritePages);
      console.log("Hämtade favoriter när app startades", favoritePages);
    }

    getFavs();
  }, []);

  // Avgör höjd på flikarna/tabbarn, dvs. hur många pixlar ska
  // annonsen flyttas upp för att inte vara iväg för flikarna.
  let tabHeight;

  if (isPlatform("android")) {
    // On Android the tab height is 50px.
    tabHeight = 56;
  } else if (isPlatform("ios")) {
    // On IOS the tab height is 56 px.
    tabHeight = 50;
  } else {
    // Fall tillbaka på 50.
    tabHeight = 50;
  }

  document.documentElement.style.setProperty(
    "--text-tv-tab-bar-height",
    `${tabHeight}px`
  );

  const adMobAdOptions = {
    adId: "ca-app-pub-1689239266452655/3336016805",
    // google test ad
    // https://developers.google.com/admob/android/test-ads#sample_ad_units
    // adId: "ca-app-pub-3940256099942544/6300978111",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    margin: tabHeight
  };

  useEffect(() => {
    try {
      AdMob.showBanner(adMobAdOptions).then(
        value => {
          // console.log("admob show banner ok", value); // true
        },
        error => {
          // console.error("admob show banner error", error); // show error
        }
      );

      // AdMob.addListener("onAdFailedToLoad", info => {
      //   console.log("onAdFailedToLoad", info);
      // });

      // Callback när en annons visas. size = object med bredd och höjd, ca såhär:
      // {"width":375,"height":50}
      AdMob.addListener("onAdSize", size => {
        if (!size || !size.height) {
          return;
        }

        document.documentElement.style.setProperty(
          "--text-tv-ad-height",
          `${size.height}px`
        );
      });
    } catch (e) {
      // console.log("admob got error when trying to show banner");
    }
  }, [adMobAdOptions]);

  return (
    <TabContext.Provider value={tabsinfo}>
      <FavoritesContext.Provider value={favorites}>
        <IonApp>
          <IonReactRouter>
            {/* <BackButtonListenerWithRouter {...props} /> */}
            <Route exact path="/" render={() => <Redirect to="/hem" />} />
            <IonSplitPane contentId="mainContent">
              <MenuWithRouter {...props} />
              <div id="mainContent">
                <IonTabs id="mainTabs">
                  <IonRouterOutlet id="routerOutletElm">
                    <Route path="/test" component={PageTest} />
                    <Route path="/testar" component={PageTestar} exact={true} />
                    <Route
                      path="/testar/undersida/:undersida/"
                      component={PageTestarUndersida}
                    />
                    <Route path="/hem" component={Startsida} exact={true} />
                    <Route path="/hem/:pageNum" component={PageTextTV} />

                    <Route path="/arkiv" component={TabPopulart} exact={true} />
                    <Route
                      path="/arkiv/:pageNum"
                      component={PageTextTV}
                      exact={true}
                    />
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
                    <Route
                      path="/:pageNum([0-9]{3}.*)"
                      component={PageCatchAll}
                    />
                  </IonRouterOutlet>

                  <IonTabBar slot="bottom">
                    <IonTabButton
                      tab="hem"
                      href="/hem"
                      onClick={handleTabClick}
                    >
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
                      // onClick={props => {
                      //   console.log(
                      //     "navcontext",
                      //     navcontext,
                      //     navcontext.navigate
                      //   );

                      //   navcontext.navigate("/sidor/123");
                      //   // return (React.createElement(IonTabBarUnwrapped, Object.assign({}, props, { navigate: props.navigate || ((path, direction) => {
                      //         context.navigate(path, direction);
                      //     }), currentPath: props.currentPath || context.currentPath }), props.children));
                      // }}
                    >
                      {/* <TestWithRouter
                      onClick={props => {
                        console.log("click testwithrouter", this, props);
                        props.history.push("/sidor/101");
                      }}
                    /> */}
                      <IonIcon icon={eye} mode="md" />
                      <IonLabel>Mest läst</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </div>
            </IonSplitPane>
          </IonReactRouter>
        </IonApp>
      </FavoritesContext.Provider>
    </TabContext.Provider>
  );
}

export default TextTVApp;
