import { Redirect } from "react-router-dom";
import { getPageRangeInfo } from "../functions";
import { Page404 } from "../pages/page-404.js";

/**
 * Komponent som alltid renderas, i.e. catch all component i React Router.
 * Används för att visa sidor /100 /100,101, /100-104,377 osv, dvs utan "sida"-prefix
 *
 * @param object props
 */
const PageCatchAll = (props) => {
  let { pageNum } = props.match.params;

  // Sidnummer kan innehålla "/"" om man av nån anledning skrivit in det manuellt.
  pageNum = pageNum.replace(/\/$/, "");

  const pageRangeInfo = getPageRangeInfo(pageNum);
  if (pageRangeInfo.allValid) {
    // Skicka vidare till sida
    return <Redirect to={`/sidor/${pageNum}`} />;
  } else {
    return <Page404 />;
  }
};

export default PageCatchAll;
