import React from "react";

const TabContext = React.createContext({
  lastClickedTime: null,
  lastClickedName: null
});

const detfaultTabinfoState = {
  lastClicked: {
    name: null,
    time: null
  },
  prevClicked: {
    name: null,
    time: null
  },
  isNewTab: undefined,
  isSameTab: undefined,
  tabs: {
    hem: {},
    sidor: {},
    nyast: {},
    populart: {}
  }
};

export { TabContext, detfaultTabinfoState };
