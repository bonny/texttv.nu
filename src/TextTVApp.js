import { Plugins, StatusBarStyle } from "@capacitor/core";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import { IonApp, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import "./app.css";
import { FavoritesContext } from "./contexts/FavoritesContext";
import { getTabHeight, loadFavorites } from "./functions";
import { Navigationsflikar } from "./modules/Navigationsflikar";
import { MenuWithRouter } from "./modules/SideMenu";
import { adMobAdOptions } from "./options";
import "./theme.css";

const { SplashScreen, AdMob, StatusBar } = Plugins;

try {
  AdMob.initialize()
    .then(() => {
      // console.log("AdMob init ok");
    })
    .catch((e) => {
      // console.log("AdMob init catch", e);
    });
} catch (e) {
  // console.log("got error when trying to init admob", e);
}

SplashScreen.hide();

StatusBar.setStyle({
  style: StatusBarStyle.Dark,
});

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
    try {
      AdMob.showBanner(adMobAdOptions).then();

      // Callback när en annons visas. size = object med bredd och höjd, ca såhär:
      // {"width":375,"height":50}
      AdMob.addListener("onAdSize", (size) => {
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
    <FavoritesContext.Provider value={favorites}>
      <IonApp>
        <IonReactRouter>
          <Route exact path="/" render={() => <Redirect to="/hem" />} />
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
