import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { TextTVPage } from "../modules/TextTVPage";

function PageTestTextTVSida(props) {
  const urlPageNum = props.match.params.urlPageNum;
  const history = props.history;
  const [pageNum, setPageNum] = useState(100);
  const [refreshTime] = useState(0);

  useEffect(() => {
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

  // const classes = classNames({
  //   "TextTVPage--isLoading": pageIsLoading,
  //   "TextTVPage--isDoneLoading": pageIsDoneLoading,
  //   TextTVPage: true,
  // });

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

        <div>
          <TextTVPage pageNum={pageNum} refreshTime={refreshTime} />
        </div>
      </IonContent>
    </IonPage>
  );
}

export { PageTestTextTVSida };
