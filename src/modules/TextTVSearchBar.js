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
      target.blur();
      target.value = "";
      document.querySelector("ion-menu-controller").close();
      history.push(`/sidor/${pageNum}`);
    }
  };

  // const icon = isLoading ? "document" : "search";

  return (
    <>
      <IonSearchbar
        color="dark"
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
