import { IonContent, IonToolbar } from "@ionic/react";
import React from "react";
import TextTVHeader from "../modules/TextTVHeader";
import TextTVSidorLista from "../modules/TextTVSidorLista";
import TextTVSearchBar from "../modules/TextTVSearchBar";

export default props => {
  const { history } = props;

  // const handlePageNumInputChange = e => {
  //   const pageNum = e.target.value;
  //   if (pageNum.length === 3) {
  //     history.push(`/sida/${pageNum}`);
  //     e.target.value = "";
  //     document.querySelector("ion-menu-controller").close();
  //   }
  // };

  // const OneItem = props => {
  //   const { lines = "inset", title, pages } = props;
  //   const url = `/sida/${pages}`;
  //   return (
  //     <IonItem
  //       button
  //       detail
  //       onClick={() => {
  //         document.querySelector("ion-menu-controller").close();
  //         history.push(url);
  //       }}
  //       lines={lines}
  //       color="dark"
  //     >
  //       <IonLabel text-wrap>
  //         <h2 className="ListHeadlineSidor">{title}</h2>
  //         <p>{pages}</p>
  //       </IonLabel>
  //     </IonItem>
  //   );
  // };

  // const OneHeadlineItem = props => {
  //   const itemStyles = {
  //     color: "var(--text-tv-color-cyan)"
  //   };
  //   const { title } = props;
  //   return (
  //     <IonCol size="12">
  //       <IonItem lines="none" style={itemStyles}>
  //         <IonLabel>{title}</IonLabel>
  //       </IonItem>
  //     </IonCol>
  //   );
  // };

  // const OneHeadlineItem2 = props => {
  //   const itemStyles = {
  //     color: "var(--text-tv-color-cyan)"
  //   };
  //   const { title } = props;
  //   return (
  //     <IonCol size="12">
  //       <IonItem lines="none" style={itemStyles}>
  //         <IonLabel>{title}</IonLabel>
  //       </IonItem>
  //     </IonCol>
  //   );
  // };

  return (
    <>
      <TextTVHeader title="Sidor">
        <IonToolbar color="primary">
          <TextTVSearchBar history={history} />
        </IonToolbar>
      </TextTVHeader>
      <IonContent color="dark">
        <TextTVSidorLista {...props} showHeader={false} />
      </IonContent>
    </>
  );
};
