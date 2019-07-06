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
import { home, listBox, clock, trendingUp } from "ionicons/icons";
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

const { SplashScreen } = Plugins;

SplashScreen.hide();

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
                  <Route path="/sida/:pageNum" component={PageTextTV} />
                  <Route
                    path="/arkivsida/:pageNum/:pageId/"
                    component={PageTextTV}
                  />
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
