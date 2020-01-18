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
  IonToolbar
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import React, { useState, useEffect } from "react";

export default props => {
  const { isOpen, pages, handleSaveModal, handleCancelModal } = props;
  const [showAddPageAlert, setShowAddPageAlert] = useState(false);
  const [pageNums, setPageNums] = useState([]);

  useEffect(() => {
    setPageNums(pages);
  }, [pages]);

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Favoriter</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              fill="clear"
              color="secondary"
              onClick={() => {
                handleSaveModal(pageNums);
              }}
            >
              Spara
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton
              fill="clear"
              color="secondary"
              onClick={() => {
                setPageNums(pages);
                handleCancelModal();
              }}
            >
              Avbryt
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol class="ion-margin">
              <p>Sidorna du anger här visas när du går till startsidan/hem.</p>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonReorderGroup
                disabled={false}
                no-padding
                onIonItemReorder={itemReorderEventDetail => {
                  setPageNums(itemReorderEventDetail.detail.complete([...pageNums]));
                }}
              >
                {pageNums.map(pagenum => {
                  return (
                    <IonItem key={pagenum}>
                      <IonLabel>{pagenum}</IonLabel>
                      <IonReorder slot="start" />
                      <IonIcon
                        slot="end"
                        icon={close}
                        onClick={e => {
                          setPageNums(pageNums.filter(num => num !== pagenum));
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
          onDidDismiss={() => setShowAddPageAlert(false)}
          header="Lägg till"
          message="Ange sida att lägga till."
          inputs={[
            {
              name: "pagenumber",
              type: "number",
              min: 100,
              max: 999,
              placeholder: "T.ex. 100 eller 377."
            }
          ]}
          buttons={[
            {
              text: "Avbryt",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
              }
            },
            {
              text: "Lägg till",
              handler: values => {
                setPageNums([...pageNums, values.pagenumber]);
              }
            }
          ]}
        />
      </IonContent>
    </IonModal>
  );
};
