import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonReorder,
  IonReorderGroup,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { FirebaseAnalytics } from "../analytics";
import { AdMob } from "@capacitor-community/admob";

const RedigeraFavoriter = (props) => {
  const { isOpen, pages, handleSaveModal, handleCancelModal } = props;
  const [showAddPageAlert, setShowAddPageAlert] = useState(false);
  const [pageNums, setPageNums] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Logga när ändra favoriter-modal visas.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    try {
      FirebaseAnalytics.logEvent({
        name: "edit_favorites_show",
      });
    } catch (e) {}
  }, [isOpen]);

  useEffect(() => {
    setPageNums(pages);
  }, [pages]);

  // Göm annonser när modal visas för annars hamnar annonsen över.
  useEffect(() => {
    if (isOpen) {
      AdMob.hideBanner();
    } else {
      AdMob.resumeBanner();
    }
  }, [isOpen]);

  const handleCancel = () => {
    setPageNums(pages);
    handleCancelModal();
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={handleCancel}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Favoriter</IonTitle>
            <IonButtons slot="primary">
              <IonButton
                fill="clear"
                color="secondary"
                onClick={() => {
                  setToastMessage("🌟Favoriterna sparades 👍");
                  setShowToast(true);
                  handleSaveModal(pageNums);
                  try {
                    FirebaseAnalytics.logEvent({
                      name: "edit_favorites_save",
                      params: {
                        page_nums: pageNums,
                      },
                    });
                  } catch (e) {}
                }}
              >
                Spara
              </IonButton>
            </IonButtons>
            <IonButtons slot="secondary">
              <IonButton fill="clear" color="secondary" onClick={handleCancel}>
                Avbryt
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-margin">
                <p>
                  Sidorna du anger här visas när du går till startsidan/hem.
                </p>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonReorderGroup
                  disabled={false}
                  no-padding
                  onIonItemReorder={(itemReorderEventDetail) => {
                    setPageNums(
                      itemReorderEventDetail.detail.complete([...pageNums])
                    );
                  }}
                >
                  {pageNums.map((pagenum) => {
                    return (
                      <IonItem key={pagenum}>
                        <IonLabel>{pagenum}</IonLabel>
                        <IonReorder slot="start" />
                        <IonIcon
                          slot="end"
                          icon={close}
                          onClick={(e) => {
                            setPageNums(
                              pageNums.filter((num) => num !== pagenum)
                            );
                          }}
                        />
                      </IonItem>
                    );
                  })}
                </IonReorderGroup>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonButton
                  fill="outline"
                  color="secondary"
                  onClick={() => {
                    setShowAddPageAlert(true);
                  }}
                >
                  <IonIcon slot="icon-only" icon={add} />
                  Lägg till sida…
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonAlert
            isOpen={showAddPageAlert}
            onDidDismiss={() => {
              setShowAddPageAlert(false);
            }}
            header="Lägg till"
            message="Ange sida att lägga till."
            inputs={[
              {
                name: "pagenumber",
                type: "number",
                min: 100,
                max: 999,
                placeholder: "T.ex. 100 eller 377.",
              },
            ]}
            buttons={[
              {
                text: "Avbryt",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {},
              },
              {
                text: "Lägg till",
                handler: (values) => {
                  // Lägg till nya sidan men se till att den inte redan finns
                  // och att den är ett giltigt nummer.
                  if (values.pagenumber < 100 || values.pagenumber > 999) {
                    return false;
                  }
                  let pageNumWithNewNum = [...pageNums, values.pagenumber];
                  pageNumWithNewNum = [...new Set(pageNumWithNewNum)];
                  setPageNums(pageNumWithNewNum);
                },
              },
            ]}
          />
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => {
          setShowToast(false);
        }}
        message={toastMessage}
        position="bottom"
        duration="2500"
        cssClass="TextTVPage_Toast"
      />
    </>
  );
};

export { RedigeraFavoriter };
