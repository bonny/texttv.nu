import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { TextTVPage } from "../modules/TextTVPage";

function PageTestTextTVSida(props) {
  const urlPageNum = props.match.params.urlPageNum;
  const history = props.history;
  const [pageNum, setPageNum] = useState(100);
  const [refreshTime, setRefreshTime] = useState(0);

  useLayoutEffect(() => {
    if (!urlPageNum) {
      return;
    }

    setPageNum(urlPageNum);
  }, [urlPageNum]);

  const handleClickNextPageProps = (e) => {
    setPageNum(parseInt(pageNum) + 1);
  };

  const handleClickNextPageURL = (e) => {
    const nextPageNum = 1 + parseInt(pageNum);
    const nextPageURL = `/test/texttvsida/${nextPageNum}`;
    history.push(nextPageURL);
  };

  console.log("render", { urlPageNum }, { pageNum });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test Text TV-sida</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-padding">
          pageNum: {pageNum}.
          <br />
          urlPageNum: {urlPageNum}
          <br />
          <IonButton onClick={handleClickNextPageProps}>
            Nästa sida via props
          </IonButton>
          <br />
          <IonButton onClick={handleClickNextPageURL}>
            Nästa sida via URL
          </IonButton>
        </p>

        <TextTVPage pageNum={pageNum} refreshTime={refreshTime} />
      </IonContent>
    </IonPage>
  );
}

export { PageTestTextTVSida };
