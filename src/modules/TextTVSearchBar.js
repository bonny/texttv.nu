import { IonSearchbar } from "@ionic/react";
import { logPageView } from "../functions";

/**
 * "Sökruta"/gå-till-sida-input som ska ligga i IonHeader > IonToolbar.
 */
const TextTVSearchBar = (props) => {
  const { history } = props;

  const handlePageNumInputChange = (e) => {
    const target = e.target;
    let pageNum = target.value;

    // Tillåt endast siffror.
    pageNum = pageNum.replace(/\D/g, '');
    target.value = pageNum;

    // Baila om vi inte har tre tecken, dvs. ett sidnummer.
    if (pageNum.length !== 3) {
      return;
    }

    target.value = "";
    history.push(`/sidor/${pageNum}`);

    e.target.getInputElement().then((elm) => {
      elm.blur();
    });

    logPageView(pageNum, "manually");
  };

  return (
    <IonSearchbar
      placeholder="Gå till sida…"
      type="text"
      inputmode="decimal"
      pattern="\d*"
      showCancelButton="never"
      onIonInput={handlePageNumInputChange}
      debounce="100"
      className="texttv-pagenumber-input"
      enterkeyhint="go"
    />
  );
};

export default TextTVSearchBar;
