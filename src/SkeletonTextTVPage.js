import { IonCard, IonSkeletonText } from "@ionic/react";
import React from "react";

export function SkeletonTextTVPage() {
  const skeletonWrapStyle = {
    backgroundColor: "rgb(17, 30, 63)",
    padding: "14px"
  };
  const skeletonStyle = {
    height: "14px",
    backgroundColor: "#ddd",
    width: "100%",
    opacity: 0.25
  };
  const SkeletonRowYellow = () => (
    <IonSkeletonText
      animated
      style={{
        ...skeletonStyle,
        backgroundColor: "#e2e200"
      }}
    />
  );
  const SkeletonRowWhite = () => (
    <IonSkeletonText
      animated
      style={{
        ...skeletonStyle
      }}
    />
  );
  const SkeletonRowBlue = () => (
    <IonSkeletonText
      animated
      style={{
        ...skeletonStyle,
        backgroundColor: "#00f"
      }}
    />
  );
  const skeletonPage = (
    <>
      <IonCard>
        <div style={skeletonWrapStyle}>
          <SkeletonRowWhite />
          <SkeletonRowBlue />
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowYellow />
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowBlue />
        </div>
      </IonCard>
    </>
  );
  return skeletonPage;
}
