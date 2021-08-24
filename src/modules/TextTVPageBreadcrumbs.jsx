import { IonIcon } from "@ionic/react";
import { homeSharp } from "ionicons/icons";
import { Link } from "react-router-dom";

export const TextTVPageBreadcrumbs = (props) => {
  const firstPageBreadcrumbs = props?.pageData?.slice(0, 1)?.pop()?.breadcrumbs;

  if (!firstPageBreadcrumbs || !firstPageBreadcrumbs.length) {
    return null;
  }

  const listStyles = {
    // borderTop: "1px solid #222",
    listStyle: "none",
    padding: "0 0 .5em 0",
    margin: "0 0 .5em .2em",
    textAlign: "left",
    borderBottom: "1px solid #222",
    fontSize: "1rem",
    verticalAlign: "middle",
  };

  const listItemStyles = {
    // outline: "1px solid red",
    display: "inline-block",
    // verticalAlign: "middle",
    // lineHeight: 1
  };

  const linkStyles = {
    // outline: "1px solid pink",
    display: "inline-block",
    padding: ".5em .5em .75em .5em",
    color: "#aaa",
    textUnderlineOffset: "4px",
    textDecorationThickness: '2px',
    textDecorationColor: '#555'
  };

  const itemDivider = {
    // outline: "1px solid green",
    padding: "0 .15em",
    margin: 0,
    color: "#444",
    // verticalAlign: "middle",
  };

  const lastItemStyles = {
    ...linkStyles,
  };

  const iconStyles = {
    height: "1.8ex",
    position: "relative",
    top: "7px",
    padding: "0 0 3px 0",
    borderBottom: "2px solid #555",
  };

  const breadcrumbs = firstPageBreadcrumbs.map((crumb, idx, arr) => {
    return (
      <li key={crumb.num} style={listItemStyles}>
        {idx < arr.length - 1 && (
          <>
            <Link to={crumb.url} style={linkStyles}>
              {idx === 0 && <IonIcon style={iconStyles} icon={homeSharp} />}
              {idx > 0 && crumb.name}
            </Link>

            <span style={itemDivider}>/</span>
          </>
        )}
        {idx === arr.length - 1 && (
          <span style={lastItemStyles}>{crumb.name}</span>
        )}
      </li>
    );
  });

  return <ol style={listStyles}>{breadcrumbs}</ol>;
};
