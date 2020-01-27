import React from "react";

const TabContext = React.createContext({
  lastClickedTime: null,
  lastClickedName: null
});

export { TabContext };
