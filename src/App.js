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
  // IonCardHeader,
  // IonCardTitle,
  // IonCardSubtitle
} from "@ionic/react";
import {
  home,
  listBox,
  clock,
  trendingUp,
  eye,
  flame,
  glasses
} from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { MenuWithRouter } from "./Menu";
import PageTextTV from "./pages/page-TextTV.js";
// import { TabHome } from "./tab-home";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-populart";
import TabSidor from "./pages/tab-sidor";
import "./theme.css";
import "./App.css";
import Startsida from "./pages/tab-startsida";
import { PageTest, PageTestar, PageTestarUndersida } from "./pages/PageTest";
import { getPageRangeInfo } from "./functions";

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
    // return <PageTextTV {...props} />;
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

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/" render={() => <Redirect to="/hem" />} />
        <IonSplitPane contentId="main">
          <MenuWithRouter {...props} />
          <IonPage id="main">
            <IonPage>
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
                  <IonTabButton tab="hem" href="/hem">
                    <IonIcon icon={home} mode="md" />
                    <IonLabel>Hem</IonLabel>
                    {/* <IonBadge color="danger">6</IonBadge> */}
                  </IonTabButton>

                  <IonTabButton
                    tab="sidor"
                    href="/sidor"
                    className="ion-hide-lg-up"
                  >
                    <IonIcon icon={listBox} mode="md" />
                    <IonLabel>Sidor</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="nyast" href="/nyast">
                    <IonIcon icon={clock} mode="md" />
                    <IonLabel>Nyast</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="populart" href="/mest-last">
                    <IonIcon icon={trendingUp} mode="md" />
                    <IonLabel>Mest läst</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="populart" href="/mest-last">
                    <IonIcon icon={eye} mode="md" />
                    <IonLabel>Mest läst</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="populart" href="/mest-last">
                    <IonIcon icon={flame} mode="md" />
                    <IonLabel>Mest läst</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="populart" href="/mest-last">
                    <IonIcon icon={glasses} mode="md" />
                    <IonLabel>Mest läst</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonPage>
          </IonPage>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
