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
  IonBadge
} from "@ionic/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { TabHome } from "./tab-home";
import { TabPopulart } from "./tab-populart";
import { TabNyast } from "./tab-nyast";
import "./App.css";
import "./theme.css";

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
            <IonPage>
              <IonPage>
                <Route exact path="/" render={() => <Redirect to="/hem" />} />
                <IonTabs>
                  <IonRouterOutlet>
                    <Route
                      path="/:tab(hem)"
                      // component={TabHome}
                      render={props => (
                        <TabHome
                          {...props}
                          currentTab={currentTab}
                          prevTab={prevTab}
                        />
                      )}
                      exact={true}
                    />
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
                  <IonTabBar slot="bottom" onClick={handleTabsDidChange}>
                    <IonTabButton tab="hem" href="/hem">
                      <IonIcon name="home" />
                      <IonLabel>Hem c:{currentTab}</IonLabel>
                      {/* <IonBadge color="danger">6</IonBadge> */}
                    </IonTabButton>
                    <IonTabButton tab="populart" href="/populart">
                      <IonIcon name="trending-up" />
                      <IonLabel>Populärt p:{prevTab}</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="nyast" href="/nyast">
                      <IonIcon name="clock" />
                      <IonLabel>Nyast</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </IonPage>
            </IonPage>
          </IonApp>
        </div>
      </Router>
    </>
  );
}

export default App;
