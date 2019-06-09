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
import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import "./App.css";
import { MenuWithRouter } from "./Menu";
import { Page_TextTVPage } from "./Page_TextTVPage";
import { TabHome } from "./tab-home";
import { TabNyast } from "./tab-nyast";
import { TabPopulart } from "./tab-populart";
import "./theme.css";

function App(props) {
  // const [currentTab, setCurrentTab] = useState("hem");
  // const [prevTab, setPrevTab] = useState();

  const handleTabsDidChange = e => {
    // setPrevTab(currentTab);
    // setCurrentTab(e.currentTarget.selectedTab);
  };

  return (
    <>
      <Router>
        <div id="App">
          <IonApp>
            <IonSplitPane contentId="main">
              <MenuWithRouter {...props} />
              <IonPage id="main">
                <Route exact path="/" render={() => <Redirect to="/hem" />} />
                <IonTabs>
                  <IonRouterOutlet>
                    <Route path="/sida/:pageNum" component={Page_TextTVPage} />
                    <Route path="/:tab(hem)" component={TabHome} exact={true} />
                    <Route
                      path="/:tab(populart)"
                      component={TabPopulart}
                      exact={true}
                    />
                    <Route
                      path="/:tab(nyast)"
                      component={TabNyast}
                      exact={true}
                    />
                  </IonRouterOutlet>
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="hem" href="/hem">
                      <IonIcon name="home" />
                      <IonLabel>Hem</IonLabel>
                      {/* <IonBadge color="danger">6</IonBadge> */}
                    </IonTabButton>
                    <IonTabButton tab="populart" href="/populart">
                      <IonIcon name="trending-up" />
                      <IonLabel>Mest läst</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="nyast" href="/nyast">
                      <IonIcon name="clock" />
                      <IonLabel>Nyast</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </IonPage>
            </IonSplitPane>
          </IonApp>
        </div>
      </Router>
    </>
  );
}

export default App;
