import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as bootstrap from "bootstrap";
import "./index.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
