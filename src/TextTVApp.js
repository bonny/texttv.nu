import { Plugins, StatusBarStyle } from "@capacitor/core";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  NavContext
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Analytics } from "capacitor-analytics";
import "firebase/analytics";
import * as firebase from "firebase/app";
import {
  eyeOutline,
  homeOutline,
  listOutline,
  timeOutline
} from "ionicons/icons";
import React, { useEffect, useState, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import "./App.css";
import { FavoritesContext } from "./contexts/FavoritesContext";
import { detfaultTabinfoState, TabContext } from "./contexts/TabContext";
import {
  getCacheBustTimeString,
  getTabHeight,
  getUnixtime,
  isRunningInWebBrowser,
  loadFavorites,
  useMountEffect
} from "./functions";
import { MenuWithRouter } from "./modules/SideMenu";
import { adMobAdOptions } from "./options";
import PageTextTV from "./pages/page-TextTV.js";
import PageCatchAll from "./pages/PageCatchAll";
import { PageDebug } from "./pages/pageDebug.js";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import TabPopulart from "./pages/tab-mest-last";
import TabNyast from "./pages/tab-nyast";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import "./theme.css";
const { SplashScreen, AdMob, StatusBar } = Plugins;
const analytics = new Analytics();

// Testa navcontext. Fungerar i komponenter som läggs in under IonReactRouter.
// Lägger sig ovanför tab button och fångar klickar och kringgår
// tabarnas standardbeteende där de inte går till tab-roten vid varje klick.
const TabFastNav = ({ href }) => {
  const navContext = useContext(NavContext);
  console.log("navContext", navContext);
  const styles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  };

  const navigate = () => {
    navContext.navigate(href, "none");
  };

  return <div onClick={navigate} style={styles}></div>;
};

const Tabbarna = props => {
  const { handleTabClick } = props;
  const navContext = useContext(NavContext);
  const { currentPath } = navContext;
  console.log("navContext", navContext);
  console.log("currentPath", currentPath);

  const navigate = url => {
    navContext.navigate(url, "none");
  };

  return (
    <IonTabs id="mainTabs">
      <IonRouterOutlet id="routerOutletElm">
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
        <IonTabButton
          tab="hem"
          xhref="/hem"
          selected={currentPath.startsWith("/hem")}
          onClick={e => {
            handleTabClick(e);
            navigate("/hem");
          }}
        >
          <IonIcon icon={homeOutline} />
          <IonLabel>Hem</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="sidor"
          xhref="/sidor"
          className="ion-hide-lg-up"
          selected={currentPath.startsWith("/sidor")}
          onClick={e => {
            handleTabClick(e);
            navigate("/sidor");
          }}
        >
          <IonIcon icon={listOutline} />
          <IonLabel>Sidor</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="nyast"
          xhref="/nyast"
          selected={currentPath.startsWith("/nyast")}
          onClick={e => {
            handleTabClick(e);
            navigate("/nyast");
          }}
        >
          <IonIcon icon={timeOutline} />
          <IonLabel>Nyast</IonLabel>
        </IonTabButton>

        <IonTabButton tab="populart">
          <IonIcon icon={eyeOutline} />
          <IonLabel>Mest läst</IonLabel>
          <TabFastNav href="/arkiv" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

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

const tabHeight = getTabHeight();

document.documentElement.style.setProperty(
  "--text-tv-tab-bar-height",
  `${tabHeight}px`
);

adMobAdOptions.margin = tabHeight;

function TextTVApp(props) {
  const [tabsinfo, setTabsinfo] = useState(detfaultTabinfoState);

  const initialFavoritesState = {
    pages: [],
    setPages: pages => {
      setFavorites({ ...favorites, pages: pages });
    }
  };

  const [favorites, setFavorites] = useState(initialFavoritesState);

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
  useMountEffect(() => {
    async function getFavs() {
      const favoritePages = await loadFavorites();
      favorites.setPages(favoritePages);
    }

    getFavs();
  });

  // Visa annons + sätt annons-höjd till variabel när sidan renderas.
  useEffect(() => {
    try {
      AdMob.showBanner(adMobAdOptions).then();

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
  }, []);

  return (
    <TabContext.Provider value={tabsinfo}>
      <FavoritesContext.Provider value={favorites}>
        <IonApp>
          <IonReactRouter>
            <Route exact path="/" render={() => <Redirect to="/hem" />} />
            <IonSplitPane contentId="mainContent">
              <MenuWithRouter {...props} />
              <div id="mainContent">
                <Tabbarna handleTabClick={handleTabClick} />
              </div>
            </IonSplitPane>
          </IonReactRouter>
        </IonApp>
      </FavoritesContext.Provider>
    </TabContext.Provider>
  );
}

export default TextTVApp;
