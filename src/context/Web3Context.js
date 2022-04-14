import React, { createContext, useReducer } from "react";

export const Web3Context = createContext();

const initialState = {
  admin: "",
  address: "",
  balance: "",
  totalSupply: "",
  currentVotes: "",
};

const Web3Reducer = (state, userData) => {
    state = userData;
    return state;
};

export function Web3ContextProvider(props) {
  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  return <Web3Context.Provider value={{ state, dispatch }}>{props.children}</Web3Context.Provider>;
}
