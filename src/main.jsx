import React from "react";
import { createRoot } from "react-dom/client";
import App from "./MatchdayLog";
import "./fonts.css";

createRoot(document.getElementById("root")).render(<App />);

// Offline support. Registered after load so it never slows first paint.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
