import { register } from "./WishlistDockElement";

export { WishlistDockElement, register } from "./WishlistDockElement";

export type {
  DockPosition,
  WishlistDockEventMap,
  WishlistDockHandle,
} from "./types";

if (typeof window !== "undefined" && typeof customElements !== "undefined") {
  register();
}
