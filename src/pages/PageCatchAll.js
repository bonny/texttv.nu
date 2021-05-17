import { Redirect } from "react-router-dom";
import { getPageRangeInfo } from "../functions";

/**
 * Komponent som alltid renderas, i.e. catch all component i React Router.
 * Används för att visa sidor /100 /100,101, /100-104,377 osv, dvs utan "sida"-prefix
 *
 * @param object props
 */
const PageCatchAll = (props) => {
  const { pageNum } = props.match.params;
  const pageRangeInfo = getPageRangeInfo(pageNum);
  if (pageRangeInfo.allValid) {
    // Skicka vidare till sida
    return <Redirect to={`/sidor/${pageNum}`} />;
  } else {
    return null;
  }
};

export default PageCatchAll;
