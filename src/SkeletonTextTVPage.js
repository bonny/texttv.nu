import { IonCard, IonSkeletonText } from "@ionic/react";
import React from "react";

let fortyChars = ' '.repeat(40);

let html = `<span class="toprow">${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
<span>${fortyChars}</span>
`;



export function SkeletonTextTVPage() {
  const skeletonWrapStyle = {
    backgroundColor: "rgb(17, 30, 63)",
    padding: "14px",
    display: "flex",
    justifyContent: "center"
  };

  const skeletonInnerWrapStyle = {
    maxWidth: "440px",
    flex: 1
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
      {/* <IonCard> */}
      <div style={skeletonWrapStyle}>
        <div style={skeletonInnerWrapStyle}>
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
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <SkeletonRowYellow />
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <SkeletonRowWhite />
          <IonSkeletonText animated style={{ ...skeletonStyle, opacity: 0 }} />
          <SkeletonRowBlue />
        </div>
      </div>
      {/* </IonCard> */}
    </>
  );

  const skeletonTextStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)'
  }

  const skeletonPage2 = (
    <div className="TextTVPage TextTVPage--skeleton">
    <div className="TextTVPage__wrap">
      <div
        className="TextTVPage__inner"
      >
        <IonSkeletonText animated style={skeletonTextStyle}></IonSkeletonText>
        <div className="root" dangerouslySetInnerHTML={createMarkup()}></div>
      </div>
    </div>
  </div>
  )

function createMarkup() {
  return {
    __html: html
  };
}

  return skeletonPage2;
}
