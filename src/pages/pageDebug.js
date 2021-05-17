import { Plugins } from "@capacitor/core";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { TextTVPage } from "../modules/TextTVPage";
const { AdMob } = Plugins;

function PageDebug(props) {
  let adMobAdOptionsNewAd = {
    // TextTV.nu IOS React App
    adId: "ca-app-pub-1689239266452655/6481628543",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    isTesting: false,
  };

  let adMobAdOptionsOldAd = {
    // TextTV.nu iOS Banner (gamla IOS-appen)
    adId: "ca-app-pub-1689239266452655/6790998004",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    isTesting: false,
  };

  let adMobAdOptionsTestAd = {
    adId: "ca-app-pub-3940256099942544/6300978111",
    adSize: "SMART_BANNER",
    position: "BOTTOM_CENTER",
    isTesting: false,
  };

  const showAd = (adname) => {
    let adoptions;
    switch (adname) {
      case "new":
        adoptions = adMobAdOptionsNewAd;
        break;
      case "old":
        adoptions = adMobAdOptionsOldAd;
        break;
      case "test":
        adoptions = adMobAdOptionsTestAd;
        break;
      default:
    }
    AdMob.showBanner(adoptions).then(
      (value) => {
        console.log("showBanner ok", value); // true
      },
      (error) => {
        console.error("showbanner err", error); // show error
      }
    );
  };

  const slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoHeight: true,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Debug</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Annons</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>Här testar vi annonser.</IonCardContent>

          <IonItem
            onClick={() => {
              AdMob.hideBanner();
            }}
          >
            <IonLabel>Göm annons</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              AdMob.resumeBanner();
            }}
          >
            <IonLabel>Visa annons igen</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              showAd("new");
            }}
          >
            <IonLabel>Visa ny annons</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              showAd("old");
            }}
          >
            <IonLabel>Visa gammal annons</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              showAd("test");
            }}
          >
            <IonLabel>Visa Googles test-annons</IonLabel>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Slides</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>Här testar vi slides.</p>
          </IonCardContent>
        </IonCard>

        <IonSlides
          pager={false}
          options={slideOpts}
          style={{ outline: "2px solid pink" }}
        >
          <IonSlide>
            <div>
              <TextTVPage pageNum="100" history={props.history} />
            </div>
          </IonSlide>
          <IonSlide>
            <div>
              <TextTVPage pageNum="101" history={props.history} />
            </div>
          </IonSlide>
          <IonSlide>
            <div>
              <TextTVPage pageNum="300" history={props.history} />
            </div>
          </IonSlide>
          <IonSlide>
            <div>
              <TextTVPage pageNum="100,101,102" history={props.history} />
            </div>
          </IonSlide>
          <IonSlide>
            <div>
              <TextTVPage pageNum="300-302,376,377" history={props.history} />
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
}

export { PageDebug };
