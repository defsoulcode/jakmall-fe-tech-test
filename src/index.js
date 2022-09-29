import React from "react";
import { createRoot } from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { debounce } from "debounce";

import { stepReducer, summaryReducer } from "./redux/reducers";
import { loadState, saveState } from "./redux/localStorage";
import App from "./App.jsx";
import "./assets/App.css";

const logger = createLogger();
const rootReducers = combineReducers({
  stepReducer,
  summaryReducer,
});
export const store = configureStore({
  devTools: true,
  reducer: rootReducers,
  // here we restore the previously persisted state
  preloadedState: loadState(),
  applyMiddleware: applyMiddleware(thunkMiddleware, logger),
});

store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => {
    saveState(store.getState());
  }, 800)
);

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
