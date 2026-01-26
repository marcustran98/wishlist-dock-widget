import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

export { WishlistDockElement } from "./web-component";
export type {
  WishlistDockHandle,
  WishlistDockEventMap,
  DockPosition,
} from "./web-component";
export type {
  Card,
  Stack,
  CreateCardRequest,
  CreateStackRequest,
} from "./types";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
