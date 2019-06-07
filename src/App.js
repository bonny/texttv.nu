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
  IonTabs} from "@ionic/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import "./App.css";
import Menu from "./Menu";
import { TabHome } from "./tab-home";
import { TabNyast } from "./tab-nyast";
import { TabPopulart } from "./tab-populart";
import "./theme.css";
import { Page_TextTVPage } from "./Page_TextTVPage";

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
        <div id="App">
          <IonApp>
            <IonSplitPane contentId="main">
              <Menu />
              <IonPage id="main">
                <Route exact path="/" render={() => <Redirect to="/hem" />} />
                <IonTabs>
                  <IonRouterOutlet>
                    {/* <Route
                      path="/:tab(hem|populart|nyast)/sida/:id"
                      component={Page_TextTVPage}
                    /> */}
                    <Route path="/sida/:pageNum" component={Page_TextTVPage} />
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
