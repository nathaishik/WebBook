import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Fallback for browsers that don't support `color-contrast()`.
// Computes the resolved color of `--primary` and sets `--primary-content` to
// either `#000` or `#fff` depending on luminance.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
