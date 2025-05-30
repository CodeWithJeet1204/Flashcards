import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import SelectDeck from "./components/deck/SelectDeck";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {path === "/singleplayer" ? <SelectDeck /> : <App />}
  </React.StrictMode>
);
