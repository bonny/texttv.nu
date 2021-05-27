import { IonItem, IonLabel, IonList, IonSkeletonText } from "@ionic/react";

const SkeletonListItems = [...Array(10)].map((val, index) => {
  const pStyles = {
    height: "12px",
    width: "80px",
  };
  const H1Style = {
    height: "24px",
    width: Math.random() * (85 - 55) + 55 + "%",
  };
  return (
    <IonItem key={index} lines="none">
      <IonLabel text-wrap class="ion-text-wrap">
        <h1>
          <IonSkeletonText animated style={H1Style} />
        </h1>
        <p>
          <IonSkeletonText animated style={pStyles} />
        </p>
      </IonLabel>
    </IonItem>
  );
});

const SkeletonList = <IonList>{SkeletonListItems}</IonList>;

export default SkeletonList;
