import { IonSearchbar } from "@ionic/react";
import { FirebaseAnalytics } from "../analytics";

/**
 * "Sökruta"/gå-till-sida-input som ska ligga i IonHeader > IonToolbar.
 */
const TextTVSearchBar = (props) => {
  const { history } = props;

  const handlePageNumInputChange = (e) => {
    const target = e.target;
    const pageNum = target.value;

    // Baila om vi inte har tre tecken, dvs. ett sidnummer.
    if (pageNum.length !== 3) {
      return;
    }

    target.value = "";
    history.push(`/sidor/${pageNum}`);

    e.target.getInputElement().then((elm) => {
      elm.blur();
    });

    try {
      FirebaseAnalytics.logEvent({
        name: "go_to_page",
        params: {
          type: "manually",
          page_num: pageNum,
        },
      });
    } catch (e) {}
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
