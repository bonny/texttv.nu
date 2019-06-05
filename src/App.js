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
  IonTabs
} from "@ionic/react";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { TabHome } from "./tab-home";
import { TabPopulart } from "./tab-populart";
import { TabNyast } from "./tab-nyast";
import "./App.css";
import "./theme.css";

function App() {
  return (
    <>
      <Router>
        {/* <Switch>
          <Redirect exact={true} from="/" to="/hem" />
        </Switch> */}
        <div id="app">
          <IonApp>
            <IonPage id="main">
              <IonPage>
                <IonTabs>
                  <IonRouterOutlet>
                    <Route
                      path="/"
                      component={TabHome}
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
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="hem" href="/">
                      <IonIcon name="home" />
                      <IonLabel>Hem</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="populart" href="/populart">
                      <IonIcon name="trending-up" />
                      <IonLabel>Populärt</IonLabel>
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
