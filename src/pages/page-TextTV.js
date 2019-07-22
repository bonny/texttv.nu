/**
 * Visar en sida med en eller flera text-tv-sidor.
 */
import { Plugins } from "@capacitor/core";
import { IonContent, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  getCurrentIonPageContentElm,
  getPageRangeInfo,
  getUnixtime,
  stripHtml
} from "../functions";
import Header from "../modules/Header";
import TextTVPage from "../modules/TextTVPage";
import TextTVRefresher from "../modules/TextTVRefresher";

const { Clipboard, Share } = Plugins;

const PageTextTV = props => {
  const {
    match,
    history,
    title,
    headerStyle = "HEADER_STYLE_DEFAULT",
    children,
    refreshTime: passedRefreshTime,
    // Custom function att köra om refresh-knappen tryckts på.
    onRefresh
  } = props;

  const pageNum = props.pageNum || match.params.pageNum;
  const pageId = props.pageId || match.params.pageId;
  const [refreshTime, setRefreshTime] = useState(getUnixtime());
  const [pageUpdatedToastVisible, setPageUpdatedToastVisible] = useState(false);
  const [pageData, setPageData] = useState([]);

  let pageTitle = title || `${pageNum} - SVT Text TV`;

  // console.log("PageTextTV for pageNum", pageNum);

  /**
   * Update the refresh time to the current time.
   */
  const updateRefreshTime = () => {
    setRefreshTime(getUnixtime());
    if (onRefresh) {
      // console.log("call onRefresh in updateRefreshTime", onRefresh);
      onRefresh();
    }
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

  const handleShare = async e => {
    // Hämta alla sidorn IDn
    let pageIdsString = "";
    pageData.forEach(page => {
      pageIdsString = pageIdsString + `,${page.id}`;
    });

    // Bort med första kommatecknet.
    pageIdsString = pageIdsString.replace(/^,/, "");

    // Permalänk.
    const permalink = `https://www.texttv.nu/${pageNum}/arkiv/sida/${pageIdsString}`;

    // Titel + ev. text från första sidan.
    const firstPage = pageData[0];

    const sharePromise = Share.share({
      title: `Text TV ${firstPage.num}: ${firstPage.title}`,
      text: `${firstPage.title}
Delad vid https://texttv.nu/
`,
      url: permalink,
      dialogTitle: "Dela sida"
    });

    sharePromise
      .then(data => {
        console.log("Delning verkar gått fint. Härligt!", data);
        // Pinga denna efter delning för att meddela sajten att sidan delats.
        // I vanliga fall används denna för att hämta delningsinfo, men
        // det blir ett promise för mycket för att Safari ska godkänna delning.
        const apiEndpoint = "https://api.texttv.nu/api/share/" + pageIdsString;

        fetch(apiEndpoint);
        // TODO: Pixeltrack x2.
      })
      .catch(err => {
        console.log("Delning gick fel pga orsak", err);
      });
  };

  // Om refreshTime som skickas med är mer än vår
  // egna refreshTime så uppdaterar vi vår egna
  // för att få en uppdatering.
  useEffect(() => {
    const localUpdateRefreshTime = () => {
      setRefreshTime(getUnixtime());
      if (onRefresh) {
        // console.log("call onRefresh in useEffect", onRefresh);
        onRefresh();
      }
    };

    if (passedRefreshTime > refreshTime) {
      console.log(
        "page-texttv passedRefreshTime > refreshTime",
        passedRefreshTime,
        refreshTime
      );
      scrollToTop();
      localUpdateRefreshTime();
    }
  }, [passedRefreshTime, refreshTime, onRefresh]);

  const scrollToTop = () => {
    let currentIonPageContent = getCurrentIonPageContentElm();
    if (currentIonPageContent) {
      currentIonPageContent.scrollToTop(750);
    }
  };

  // Leta efter uppdateringar av sidan eller sidorna
  // när pageNum eller refreshTime ändrats.
  useEffect(() => {
    const checkForUpdateInterval = 10000;
    let intervalId;
    const checkForUpdate = async () => {
      // hitta ID på sidan som har högst id och kolla den
      // http://texttv.nu/api/updated/100,300,700/1439310425
      // kod körs var femte sekund i existerande app
      // https://github.com/bonny/texttv.nu/blob/master/app/texttvnucodovaapp/www/js/texttv.backbone.app.js#L675
      // TODO: refreshTime blir för unik, använd cachebust eller riktigt timestamp från sida.
      var url = `https://api.texttv.nu/api/updated/${pageNum}/${refreshTime}`;
      // console.log("checkForUpdate url", url);

      const response = await fetch(url);
      const responseJson = await response.json();
      // setPageUpdatedToastVisible(true);
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

  // Uppdatera dokument-titel.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handlePageUpdate = data => {
    // console.log("handlePageUpdate", data);
    setPageData(data);
  };

  const handleCopyTextToClipboard = () => {
    const pageRangeInfo = getPageRangeInfo(pageNum);

    let text = "";
    if (pageRangeInfo.count > 1) {
      text = text + `Text TV sidorna ${pageNum}.`;
    } else {
      text = text + `Text TV sidan ${pageNum}.`;
    }

    text = text + "\nDelat via https://texttv.nu.\n";

    pageData.forEach((page, idx) => {
      // Lägg till separator mellan sidor.
      //if (idx > 0) {
      text = text + "\n----------------------------------------\n\n";
      //}

      page.content.forEach(val => {
        text = text + val;
      });
    });

    text = stripHtml(text);

    Clipboard.write({
      string: text
    });
  };

  const handleCopyLinkToClipboard = () => {
    let pageIdsString = "";
    pageData.forEach(page => {
      pageIdsString = pageIdsString + `,${page.id}`;
    });

    pageIdsString = pageIdsString.replace(/^,/, "");

    const shareDate = new Date();
    const formattedDate = `${shareDate.getFullYear()}-${shareDate.getMonth() +
      1}-${shareDate.getDate()}`;

    const permalink = `https://texttv.nu/${pageNum}/arkiv/${formattedDate}/${pageIdsString}/`;

    Clipboard.write({
      string: permalink
    });
  };

  return (
    <>
      <Header
        {...props}
        pageTitle={pageTitle}
        headerStyle={headerStyle}
        onShare={handleShare}
        onCopyTextToClipboard={handleCopyTextToClipboard}
        onCopyLinkToClipboard={handleCopyLinkToClipboard}
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
          onPageUpdate={handlePageUpdate}
        />

        {children}

        <IonToast
          isOpen={pageUpdatedToastVisible}
          onDidDismiss={() => {
            // console.log("on did dismiss");
          }}
          position="bottom"
          translucent={true}
          // header={`Sid ${pageNum}`}
          message={`En nyare version av sidan finns.`}
          cssClass="TextTVPage_UpdatedToast"
          showCloseButton={false}
          // closeButtonText="✕"
          color="dark"
          buttons={[
            {
              side: "end",
              text: "Ladda om",
              role: "confirm",
              handler: () => {
                console.log("refresh clicked");
                setPageUpdatedToastVisible(false);
                updateRefreshTime();
              }
            },
            {
              side: "end",
              text: "✕",
              role: "confirm",
              handler: () => {
                // Göm toast.
                // För hur länge? För alltid? För alltid för denna sida? Bara för denna uppdatering?
                console.log("close toast clicked");
                setPageUpdatedToastVisible(false);
                // updateRefreshTime();
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
