import React from "react";
import PageTextTV from "./page-TextTV.js";
import SenastUppdaterat from "../modules/SenastUppdaterat";

const Startsida = props => {
  return (
    <>
      <PageTextTV
        {...props}
        pageNum="100,300,700"
        title="TextTV.nu"
        headerStyle="HEADER_STYLE_STARTPAGE"
      >
        <h2 className="ion-padding-start ion-padding-top ion-padding-end">
          Senaste nyheterna
        </h2>
        <SenastUppdaterat {...props} selectedSegment="news" count="5" />

        <h2 className="ion-padding-start ion-padding-top ion-padding-end">
          Senaste sportnyheterna
        </h2>
        <SenastUppdaterat {...props} selectedSegment="sports" count="5" />
      </PageTextTV>
    </>
  );
};

export default Startsida;
