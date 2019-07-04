import { IonItem, IonLabel } from "@ionic/react";
import React from "react";
import "moment/locale/sv";
import Moment from "react-moment";

const PagesListing = props => {
  // linkto = pagenum | pageid
  const { pages, history, linkTo = "pagenum" } = props;

  return pages.map((page, index, arr) => {
    // No line on last item.
    const lines = index === arr.length - 1 ? "none" : "inset";
    let link;

    switch (linkTo) {
      case "pageid":
        link = `/arkivsida/${page.page_num}/${page.id}`;
        break;
      case "pagenum":
      default:
        link = `/sida/${page.page_num}`;
    }

    return (
      <IonItem
        button
        detail
        onClick={e => {
          history.push(link);
        }}
        key={page.id}
        lines={lines}
        color="dark"
      >
        <IonLabel text-wrap>
          <h2 className="ListHeadline">{page.title}</h2>
          <p>
            <Moment unix fromNow locale="sv" className="MomentTime">
              {page.date_added_unix}
            </Moment>
          </p>
        </IonLabel>
      </IonItem>
    );
  });
};

export default PagesListing;
