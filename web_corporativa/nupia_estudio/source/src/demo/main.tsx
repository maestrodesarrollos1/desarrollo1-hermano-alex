import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OpeningDemo from "./OpeningDemo";
import "./opening.css";

createRoot(document.getElementById("opening-root")!).render(
  <StrictMode><OpeningDemo /></StrictMode>,
);
