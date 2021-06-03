import { IonSearchbar } from "@ionic/react";
import { FirebaseAnalytics } from "../analytics";

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

      try {
        FirebaseAnalytics.logEvent({
          name: "go_to_page_manually",
          params: {
            page_num: pageNum,
          },
        });
      } catch (e) {}
    }
  };

  return (
    <IonSearchbar
      placeholder="Gå till sida…"
      type="number"
      inputmode="numeric"
      showCancelButton="never"
      clearIcon={false}
      onIonChange={handlePageNumInputChange}
      debounce="100"
      className="texttv-pagenumber-input"
      enterkeyhint="go"
    />
  );
};

export default TextTVSearchBar;
