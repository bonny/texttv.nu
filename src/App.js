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
  IonContent,
  // IonCard,
  // IonCardHeader,
  // IonCardTitle,
  // IonCardSubtitle
} from "@ionic/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { MenuWithRouter } from "./Menu";
import PageTextTV from "./pages/page-TextTV.js";
import TextTVPage from "./modules/TextTVPage";
// import { TabHome } from "./tab-home";
import TabNyast from "./pages/tab-nyast";
import TabPopulart from "./pages/tab-populart";
import TabSidor from "./pages/tab-sidor";
import "./theme.css";
import "./App.css";
import Startsida from "./pages/tab-startsida";

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
      <TextTVPage pageNum="100-103" />
    </IonContent>
  );
};

function App(props) {
  // const [currentTab, setCurrentTab] = useState("hem");
  // const [prevTab, setPrevTab] = useState();

  // const handleTabsDidChange = e => {
  //   // setPrevTab(currentTab);
  //   // setCurrentTab(e.currentTarget.selectedTab);
  // };

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
                    <Route path="/sida/:pageNum" component={PageTextTV} />
                    <Route path="/arkivsida/:pageNum/:pageId/" component={PageTextTV} />
                    <Route path="/test" component={PageTest} />
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

                  <IonTabBar slot="bottom" color="primary">
                    <IonTabButton tab="hem" href="/hem">
                      <IonIcon name="home" mode="md" />
                      <IonLabel>Hem</IonLabel>
                      {/* <IonBadge color="danger">6</IonBadge> */}
                    </IonTabButton>

                    <IonTabButton tab="sidor" href="/sidor">
                      <IonIcon name="list-box" mode="md" />
                      <IonLabel>Sidor</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="nyast" href="/nyast">
                      <IonIcon name="clock" mode="md" />
                      <IonLabel>Nyast</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="populart" href="/mest-last">
                      <IonIcon name="trending-up" mode="md" />
                      <IonLabel>Mest läst</IonLabel>
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
