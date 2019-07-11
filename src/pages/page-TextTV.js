/**
 * Visar en sida med en eller flera text-tv-sidor.
 */
import { IonActionSheet, IonContent, IonToast } from "@ionic/react";
import React, { useState, useEffect } from "react";
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
  const pageId = props.pageId || match.params.pageId;
  const [actionSheetOpened, setActionSheetOpened] = useState(false);
  const [refreshTime, setRefreshTime] = useState(Math.floor(Date.now() / 1000));
  const [pageUpdatedToastVisible, setPageUpdatedToastVisible] = useState(false);

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

  // Leta efter uppdateringar av sidan eller sidorna.
  useEffect(() => {
    const checkForUpdateInterval = 10000;
    let intervalId;
    const checkForUpdate = async () => {
      // hitta ID på sidan som har högst id och kolla den
      // http://texttv.nu/api/updated/100,300,700/1439310425
      // kod körs var femte sekund i existerande app
      // https://github.com/bonny/texttv.nu/blob/master/app/texttvnucodovaapp/www/js/texttv.backbone.app.js#L675
      var url = `https://api.texttv.nu/api/updated/${pageNum}/${refreshTime}`;
      console.log("checkForUpdate url", url);

      const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson.is_ok && responseJson.update_available) {
        setPageUpdatedToastVisible(true);
      }
    };

    intervalId = setInterval(checkForUpdate, checkForUpdateInterval);

    // Sluta leta efter uppdateringar vid cleanup.
    return () => {
      clearInterval(intervalId);
    };
  }, [pageNum, refreshTime]);

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
          pageId={pageId}
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

        <IonToast
          isOpen={pageUpdatedToastVisible}
          onDidDismiss={() => {
            // console.log("on did dismiss");
          }}
          position="top"
          header={`Sid ${pageNum}`}
          message={`En nyare version av sidan finns.`}
          cssClass="TextTVPage_UpdatedToast"
          showCloseButton={true}
          closeButtonText="✕"
          color="dark"
          buttons={[
            {
              side: "end",
              text: "Ladda om",
              role: "confirm",
              handler: () => {
                console.log("refresh clicked");
                updateRefreshTime();
              }
            }
            // {
            //   text: "Ok",
            //   role: "cancel",
            //   handler: () => {
            //     console.log("Cancel clicked");
            //   }
            // }
          ]}
        />
      </IonContent>
    </>
  );
};

export default PageTextTV;
