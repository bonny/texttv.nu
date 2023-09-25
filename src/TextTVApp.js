import {
  AdMob,
  BannerAdPluginEvents,
  AdmobConsentStatus,
} from "@capacitor-community/admob";
import { App } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonApp, isPlatform, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import { adMobAdOptions } from "./adMobAdOptions";
import { FavoritesContext } from "./contexts/FavoritesContext";
import { createState } from "state-pool";
import "./css/app.css";
import "./css/texttv-page.css";
import "./css/theme.css";
import {
  getTabHeight,
  increaseStatForCustom,
  loadFavorites,
} from "./functions";
import { Navigationsflikar } from "./modules/Navigationsflikar";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

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

const consentStatus = createState(AdmobConsentStatus.UNKNOWN);

// Init admob + consent message.
AdMob.initialize({
  initializeForTesting: true,
  testingDevices: ["20639CA0A77ABBB0C705B559536A5046"],
})
  .then(async () => {
    // AdMob init ok.
    const consentInfo = await AdMob.requestConsentInfo();
    console.log("requestConsentInfo consentInfo", consentInfo);
    consentStatus.setValue(consentInfo.status);

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      console.log("before showConsentForm");
      const { status } = await AdMob.showConsentForm();
      console.log("showConsentForm status", status);
      consentStatus.setValue(status);
      // Here now we can show ads.
    }
  })
  .catch((e) => {
    // AdMob init catch.
    console.log("AdMob init catch", e);
  });

// Initiera saker på en Ios eller Android-enhet.
// Hybrid = "a device running Capacitor or Cordova".
// https://ionicframework.com/docs/react/platform
if (isPlatform("hybrid")) {
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
  const [consentStatuslocal, setConsentStatuslocal] = consentStatus.useState();

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

  // Visa annons + sätt annons-höjd till variabel när sidan renderas
  // och vi har ett consent OBTAINED.
  useEffect(() => {
    // Baila om vi inte kör på en enhet.
    if (!isPlatform("hybrid")) {
      return;
    }

    console.log("consentStatuslocal", consentStatuslocal);
    if (consentStatuslocal !== AdmobConsentStatus.OBTAINED) {
      return;
    }

    try {
      console.log("showbanner");
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
  }, [consentStatuslocal]);

  return (
    <FavoritesContext.Provider value={favorites}>
      <IonApp>
        <IonReactRouter>
          {/* <IonSplitPane contentId="mainContent"> */}
          {/* <MenuWithRouter {...props} /> */}
          <Navigationsflikar />
          {/* </IonSplitPane> */}
        </IonReactRouter>
      </IonApp>
    </FavoritesContext.Provider>
  );
}

export default TextTVApp;
