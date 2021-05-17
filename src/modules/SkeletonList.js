import { IonItem, IonLabel, IonList, IonSkeletonText } from "@ionic/react";

const SkeletonListItems = [...Array(10)].map((val, index) => {
  const pStyles = {
    height: "12px",
    width: "80px",
  };
  const H1Style = {
    height: "24px",
    width: Math.random() * (75 - 35) + 35 + "%",
  };
  return (
    <IonItem key={index}>
      <IonLabel text-wrap class="ion-text-wrap">
        <p>
          <IonSkeletonText animated style={pStyles} />
        </p>
        <h1>
          <IonSkeletonText animated style={H1Style} />
        </h1>
      </IonLabel>
    </IonItem>
  );
});

const SkeletonList = <IonList>{SkeletonListItems}</IonList>;

export default SkeletonList;
