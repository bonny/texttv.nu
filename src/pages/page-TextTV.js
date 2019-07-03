import { IonActionSheet, IonContent } from "@ionic/react";
import React, { useState } from "react";
import TextTVPage from "../modules/TextTVPage";
import Header from "../modules/Header";
import TextTVRefresher from "../modules/TextTVRefresher";

const PageTextTV = props => {
  const {
    match,
    history,
    title,
    headerStyle = "HEADER_STYLE_DEFAULT",
    children
  } = props;
  const pageNum = props.pageNum || match.params.pageNum;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));

  let pageTitle = title || pageNum;

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(Math.floor(Date.now() / 1000));
  };

  const handlePullToRefresh = e => {
    updateRefreshTime();
    setTimeout(() => {
      e.target.complete();
    }, 750);
  };

  const handleRefreshBtnClick = e => {
    updateRefreshTime();
  };

  // const handlePageNumInputChange = e => {
  //   const pageNum = e.target.value;
  //   if (pageNum.length === 3) {
  //     history.push(`/sida/${pageNum}`);
  //     e.target.value = "";
  //     document.querySelector("ion-menu-controller").close();
  //   }
  // };

  // const handleTestClick = e => {
  //   props.history.goBack();
  // };

  const handleMoreActionsClick = e => {
    console.log("handleMoreActionsClick", e);
    setActionSheetOpened(true);
  };

  // const HeaderMemoed = React.memo(props => {
  //   return <Header {...props} />;
  // });

  return (
    <>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        handleMoreActionsClick={handleMoreActionsClick}
        handleRefreshBtnClick={handleRefreshBtnClick}
      />

      <IonContent color="dark">
        <TextTVRefresher handlePullToRefresh={handlePullToRefresh} />

        <TextTVPage
          pageNum={pageNum}
          history={history}
          refreshTime={refreshTime}
          size="large"
        />

        <IonActionSheet
          isOpen={actionSheetOpened}
          onDidDismiss={() => setActionSheetOpened(false)}
          buttons={[
            {
              text: "Share",
              icon: "share",
              handler: () => {
                // console.log("Share clicked");
              }
            },
            {
              text: "Favorite",
              icon: "heart",
              handler: () => {
                // console.log("Favorite clicked");
              }
            },
            {
              text: "Cancel",
              icon: "close",
              role: "cancel",
              handler: () => {
                // console.log("Cancel clicked");
              }
            }
          ]}
        />

        {children}
      </IonContent>
    </>
  );
};

export default PageTextTV;
