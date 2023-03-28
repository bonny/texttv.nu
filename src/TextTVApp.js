import { AdMob, BannerAdPluginEvents } from "@capacitor-community/admob";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, IonSplitPane, isPlatform } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import { adMobAdOptions } from "./adMobAdOptions";
import { FavoritesContext } from "./contexts/FavoritesContext";
import "./css/app.css";
import "./css/texttv-page.css";
import "./css/theme.css";
import {
  getTabHeight,
  loadFavorites,
  increaseStatForCustom,
} from "./functions";
import { Navigationsflikar } from "./modules/Navigationsflikar";
import { MenuWithRouter } from "./modules/SideMenu";
import { App } from "@capacitor/app";
import { setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

setupIonicReact({
  mode: "md",
});

App.addListener("appStateChange", ({ isActive }) => {
  // flyttar app till bakgrund: App state changed. Is active? false
  // multitaskar fram den igen: App state changed. Is active? true
  if (isActive) {
    increaseStatForCustom("appResume");
  }
});

SplashScreen.hide();

increaseStatForCustom("appStart");

// Initiera saker på en Ios eller Android-enhet.
// Hybrid = "a device running Capacitor or Cordova".
// https://ionicframework.com/docs/react/platform
if (isPlatform("hybrid")) {
  try {
    AdMob.initialize({
      initializeForTesting: true,
      testingDevices: ["20639CA0A77ABBB0C705B559536A5046"],
    })
      .then(() => {
        // AdMob init ok.
      })
      .catch((e) => {
        // AdMob init catch.
      });
  } catch (e) {
    // AdMob init error.
  }

  StatusBar.setStyle({
    style: Style.Dark,
  });
}

const tabHeight = getTabHeight();

document.documentElement.style.setProperty(
  "--text-tv-tab-bar-height",
  `${tabHeight}px`
);

adMobAdOptions.margin = tabHeight;

function TextTVApp(props) {
  const initialFavoritesState = {
    pages: [],
    setPages: (pages) => {
      setFavorites({ ...favorites, pages: pages });
    },
  };

  const [favorites, setFavorites] = useState(initialFavoritesState);

  // Ladda in favoriter från storage när app startas.
  useEffect(() => {
    async function getFavs() {
      const favoritePages = await loadFavorites();
      favorites.setPages(favoritePages);
    }
    getFavs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Visa annons + sätt annons-höjd till variabel när sidan renderas.
  useEffect(() => {
    // Baila om vi inte kör på en enhet.
    if (!isPlatform("hybrid")) {
      return;
    }

    try {
      AdMob.showBanner(adMobAdOptions).then();

      // https://developers.google.com/admob/android/ad-load-errors
      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        console.log("admob FailedToLoad");
        console.log(JSON.stringify(err));
      });

      // Callback när en annons visas. size = object med bredd och höjd, ca såhär:
      // {"width":375,"height":50}
      AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
        if (!size || !size.height) {
          return;
        }

        document.documentElement.style.setProperty(
          "--text-tv-ad-height",
          `${size.height}px`
        );
      });
    } catch (e) {
      // AdMob got error when trying to show banner.
    }
  }, []);

  return (
    <FavoritesContext.Provider value={favorites}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="mainContent">
            <MenuWithRouter {...props} />
            <Navigationsflikar />
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </FavoritesContext.Provider>
  );
}

export default TextTVApp;
