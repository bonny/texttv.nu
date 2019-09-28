import React, { useState, useEffect } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { withRouter } from "react-router";
import { Plugins } from "@capacitor/core";
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
  isPlatform
} from "@ionic/react";
import { clock, eye, home, listBox } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import { getCacheBustTimeString } from "./functions";
import { MenuWithRouter } from "./modules/SideMenu";
import PageTextTV from "./pages/page-TextTV.js";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-mest-last";
import TabSidor from "./pages/tab-sidor";
import Startsida from "./pages/tab-startsida";
import TabContext from "./TabContext";
import { getUnixtime } from "./functions";
import { Analytics } from "capacitor-analytics";
import PageCatchAll from "./PageCatchAll";
import "./App.css";
import "./theme.css";

const { SplashScreen, AdMob, App } = Plugins;
const analytics = new Analytics();

try {
  AdMob.initialize("ca-app-pub-1689239266452655~1859283602")
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

/**
 * Komponent som lägger till lyssnare för tillbaka-knapp på Android.
 * @param {*} props
 */
const BackButtonListeners = props => {
  const { history } = props;

  useEffect(() => {
    App.addListener("appStateChange", state => {
      // state.isActive contains the active state
      // @TODO:
      // console.log("App state changed. Is active?", state.isActive);
    });

    App.addListener("appRestoredResult", data => {
      // console.log("Restored state:", data);
    });

    App.addListener("backButton", data => {
      // console.log("Backbutton:", data);
      // @TODO: Kolla att detta fungerar på Android.
      history.goBack();
    });
  }, [props, history]);

  return null;
};

const BackButtonListenerWithRouter = withRouter(BackButtonListeners);

function TextTVApp(props) {
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

  // Avgör höjd på flikarna/tabbarn, dvs. hur många pixlar ska
  // annonsen flyttas upp för att inte vara iväg för flikarna.
  let tabHeight;

  if (isPlatform("android")) {
    // On Android the tab height is 50px.
    tabHeight = "56";
  } else if (isPlatform("ios")) {
    // On IOS the tab height is 56 px.
    tabHeight = "50";
  } else {
    // Fall tillbaka på 50.
    tabHeight = "50";
  }

  const adMobAdOptions = {
    // TODO: use real AD-id
    //adId: "ca-app-pub-1689239266452655/3336016805",

    // google test ad
    // https://developers.google.com/admob/android/test-ads#sample_ad_units
    adId: "ca-app-pub-3940256099942544/6300978111",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    // hasTabBar: true, // make it true if you have TabBar Layout.
    // tabBarHeight: 56, // you can assign custom margin in pixel default is 56
    margin: tabHeight // RdLabo AdMob requires this to be a string (let adMargin = call.getString("margin") ?? "0"))
  };

  useEffect(() => {
    // console.log("useEffect admob show banner");
    try {
      AdMob.showBanner(adMobAdOptions).then(
        value => {
          // console.log("admob show banner ok", value); // true
        },
        error => {
          // console.error("admob show banner error", error); // show error
        }
      );

      // Subscibe Banner Event Listener
      AdMob.addListener("onAdLoaded", info => {
        // console.log("Banner Ad Loaded", info);
      })
        .then()
        .catch(e => {
          // console.log("AdMob onAdLoaded catch error", e);
        });
    } catch (e) {
      // console.log("admob got error when trying to show banner");
    }
  }, [adMobAdOptions]);

  // const Test = props => {
  //   console.log("Test", props);
  //   return (
  //     <div
  //       onClick={e => {
  //         props.history.push("/arkiv");
  //       }}
  //     >
  //       Hejsan
  //     </div>
  //   );
  // };
  // // const TestWithRouter = withRouter(Test);

  return (
    <TabContext.Provider value={tabsinfo}>
      <IonApp>
        <IonReactRouter>
          <BackButtonListenerWithRouter {...props} />
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
                  <Route
                    path="/hem"
                    render={props => {
                      return <Startsida {...props} />;
                    }}
                    exact={true}
                  />
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
                  <Route path="/:sidor/:pageNum" component={PageTextTV} />

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
    </TabContext.Provider>
  );
}

export default TextTVApp;
