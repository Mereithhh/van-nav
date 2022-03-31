import { createContext } from "react";

export const GlobalContext = createContext<{
  store: any;
  setStore: Function;
  reload: Function;
  loading: boolean;
}>({ store: {}, setStore: () => {}, reload: () => {},loading: true });
