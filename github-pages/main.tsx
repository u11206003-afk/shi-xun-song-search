import React from "react";
import { createRoot } from "react-dom/client";
import Page from "../app/page";
import "../app/globals.css";
import "../app/planner-overrides.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
);

