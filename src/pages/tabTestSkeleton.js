import { IonContent, IonPage } from "@ionic/react";
import SkeletonTextTVPage from "../modules/SkeletonTextTVPage";

function PageTestSkeleton() {
  return (
    <IonPage>
      <IonContent>
        <p>Skeleton kommer här:</p>
        <SkeletonTextTVPage pageNum="100" />
      </IonContent>
    </IonPage>
  );
}

export { PageTestSkeleton };
