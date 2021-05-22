import { IonItem, IonLabel } from "@ionic/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
require("dayjs/locale/sv");

dayjs.locale("sv");
dayjs.extend(relativeTime);

const ListItem = (props) => {
  const { link, page, history } = props;
  const dayJsFromNow = dayjs(page.date_added_unix * 1000).fromNow();

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
          {page.page_num} • {dayJsFromNow}
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
        key={page.id}
        passedHistory={history}
      />
    );
  });
};

export default PagesListing;
