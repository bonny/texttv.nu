import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonBadge,
  IonSplitPane,
  IonContent,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";
import { TextTVHeader } from "./modules/TextTVHeader";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { TabHome } from "./tab-home";
import { TabPopulart } from "./tab-populart";
import { TabNyast } from "./tab-nyast";
import "./App.css";
import "./theme.css";
import Menu from "./Menu";

const Page_TextTVPage = props => {
  console.log("Page_TextTVPage props", props);
  const doRefresh = e => {
    console.log("do refresh");
  };

  return (
    <>
      <TextTVHeader {...props} />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </>
  );
};

function App() {
  const [currentTab, setCurrentTab] = useState("hem");
  const [prevTab, setPrevTab] = useState();

  const handleTabsDidChange = e => {
    setPrevTab(currentTab);
    setCurrentTab(e.currentTarget.selectedTab);
  };

  return (
    <>
      <Router>
        <div>
          <IonApp>
            <IonSplitPane contentId="main">
              <Menu />
              <IonPage id="main">
                <Route exact path="/" render={() => <Redirect to="/hem" />} />
                <IonTabs>
                  <IonRouterOutlet>
                    <Route
                      path="/:tab(hem|populart|nyast)/sida/:id"
                      component={Page_TextTVPage}
                    />
                    <Route path="/sida/:id" component={Page_TextTVPage} />
                    <Route
                      path="/:tab(hem)"
                      // component={TabHome}
                      render={props => <TabHome {...props} />}
                      exact={true}
                    />
                    <Route
                      path="/:tab(populart)"
                      component={TabPopulart}
                      exact={true}
                    />
                    <Route
                      path="/:tab(nyast)"
                      // component={TabNyast}
                      exact={true}
                      render={props => <TabNyast {...props} />}
                    />
                  </IonRouterOutlet>
                  <IonTabBar slot="bottom" onClick={handleTabsDidChange}>
                    <IonTabButton tab="hem" href="/hem">
                      <IonIcon name="home" />
                      <IonLabel>Hem</IonLabel>
                      {/* <IonBadge color="danger">6</IonBadge> */}
                    </IonTabButton>
                    {/* <IonTabButton tab="populart" href="/populart">
                      <IonIcon name="trending-up" />
                      <IonLabel>Populärt</IonLabel>
                    </IonTabButton> */}
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
