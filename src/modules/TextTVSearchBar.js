import { IonSearchbar } from "@ionic/react";
import React from "react";

const TextTVSearchBar = props => {
  const { history } = props;
  // const [isLoading, setIsLoading] = useState(false);

  const handlePageNumInputChange = e => {
    const target = e.target;
    const pageNum = target.value;
    if (pageNum.length === 3) {
      // setIsLoading(true);
      history.push(`/sida/${pageNum}`);
      document.querySelector("ion-menu-controller").close();
      target.value = "";
      target.blur();
    }
  };

  // const icon = isLoading ? "document" : "search";

  return (
    <>
      <IonSearchbar
        color="secondary"
        placeholder="Gå till…"
        type="number"
        showCancelButton={false}
        clearIcon={false}
        onIonChange={handlePageNumInputChange}
        debounce="100"
      />
    </>
  );
};

export default TextTVSearchBar;
