import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [watchList, setWatchList] = useState([]);
  const [watchListTV, setWatchListTV] = useState([]);
  const { email, authenticated } = useContext(AuthContext);

  // Load from localStorage
  useEffect(() => {
    let watch = localStorage.getItem("watchList");
    let watchTV = localStorage.getItem("watchListTV");

    if (!watch) {
      localStorage.setItem("watchList", JSON.stringify([]));
    } else {
      setWatchList(JSON.parse(watch));
    }

    if (!watchTV) {
      localStorage.setItem("watchListTV", JSON.stringify([]));
    } else {
      setWatchListTV(JSON.parse(watchTV));
    }
  }, []);

  // Save to localStorage only (NO SUPABASE)
  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
    localStorage.setItem("watchListTV", JSON.stringify(watchListTV));
  }, [watchList, watchListTV]);

  return (
    <MyContext.Provider
      value={{ watchList, setWatchList, watchListTV, setWatchListTV }}
    >
      {children}
    </MyContext.Provider>
  );
};
