import { IonItem, IonLabel } from "@ionic/react";
import "moment/locale/sv";
import Moment from "react-moment";

const ListItem = (props) => {
  const { link, page, history } = props;

  return (
    <IonItem
      button
      detail
      onClick={(e) => {
        history.push(link);
      }}
      lines="none"
    >
      <IonLabel class="ion-text-wrap" text-wrap color="medium">
        <h2 className="ListHeadline">{page.title}</h2>
        <p className="ListText">
          <Moment unix fromNow locale="sv" className="MomentTime">
            {page.date_added_unix}
          </Moment>
        </p>
      </IonLabel>
    </IonItem>
  );
};

const PagesListing = (props) => {
  // linkto = pagenum | pageid
  const { pages, history, linkTo = "pagenum" } = props;
  // Om sökväg är t.ex "/sidor/100" så ger detta "sidor".
  const firstPathName = history.location.pathname
    .split("/")
    .filter((e) => e)
    .find((e) => true);

  let linkprefix = "";
  switch (firstPathName) {
    case "nyast":
      linkprefix = "nyast";
      break;
    case "arkiv":
      linkprefix = "arkiv";
      break;
    default:
      linkprefix = "sidor";
  }

  return pages.map((page, index, arr) => {
    // No line on last item.
    // const lines = index === arr.length - 1 ? "none" : "inset";
    let link;

    switch (linkTo) {
      case "pageid":
        link = `/arkiv/${page.page_num}/${page.id}`;
        break;
      case "pagenum":
      default:
        link = `/${linkprefix}/${page.page_num}`;
    }

    return (
      <ListItem
        {...props}
        link={link}
        page={page}
        // lines={lines}
        key={page.id}
        passedHistory={history}
      />
    );
  });
};

export default PagesListing;
