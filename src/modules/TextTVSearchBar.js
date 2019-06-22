import { IonSearchbar } from "@ionic/react";
import React from "react";

const TextTVSearchBar = props => {
  const { history } = props;

  const handlePageNumInputChange = e => {
    const pageNum = e.target.value;
    if (pageNum.length === 3) {
      history.push(`/sida/${pageNum}`);
      e.target.value = "";
      document.querySelector("ion-menu-controller").close();
    }
  };

  return (
    <IonSearchbar
      color="secondary"
      placeholder="Gå till…"
      type="number"
      showCancelButton={false}
      clearIcon={false}
      onIonChange={handlePageNumInputChange}
    />
  );
};

export default TextTVSearchBar;
