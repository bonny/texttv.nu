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
  IonTabs,
  IonToast,
  IonButton,
  IonContent
} from "@ionic/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import "./App.css";
import { MenuWithRouter } from "./Menu";
import { Page_TextTVPage } from "./Page_TextTVPage";
import { TabHome } from "./tab-home";
import { TabNyast } from "./tab-nyast";
import { TabPopulart } from "./tab-populart";
import "./theme.css";

const PageTest = props => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = props => {
    setIsOpen(true);
  };

  return (
    <IonContent>
      <IonButton onClick={handleClick}>Toast</IonButton>
      <IonToast
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        message="En uppdatering av sidan finns"
        position="bottom"
        duration="3000"
        translucent={true}
        buttons={[
          {
            side: "end",
            icon: "refresh",
            text: "Ladda om",
            role: "primary",
            handler: () => {
              console.log("Favorite clicked");
            }
          },
          {
            side: "end",
            icon: "close",
            text: "",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          }
        ]}
      />
    </IonContent>
  );
};

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
                    <Route path="/test" component={PageTest} />
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
                  <IonTabBar slot="bottom" color="primary">
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
