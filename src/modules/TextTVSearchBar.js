import { IonSearchbar } from "@ionic/react";
import React from "react";

const TextTVSearchBar = (props) => {
  const { history } = props;

  const handlePageNumInputChange = (e) => {
    const target = e.target;
    const pageNum = target.value;

    if (pageNum.length === 3) {
      target.value = "";
      history.push(`/sidor/${pageNum}`);

      e.target.getInputElement().then((elm) => {
        elm.blur();
      });
    }
  };

  // const icon = isLoading ? "document" : "search";

  return (
    <IonSearchbar
      placeholder="Gå till…"
      type="number"
      inputmode="numeric"
      showCancelButton="never"
      clearIcon={false}
      onIonChange={handlePageNumInputChange}
      debounce="100"
    />
  );
};

export default TextTVSearchBar;
