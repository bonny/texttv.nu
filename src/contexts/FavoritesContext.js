import React from "react";

const FavoritesContext = React.createContext({
  pages: [],
  setPages: () => {},
});

export { FavoritesContext };
