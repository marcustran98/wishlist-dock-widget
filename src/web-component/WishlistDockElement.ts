import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { WishlistDockRoot } from "./WishlistDockRoot";
import { SWIPER_CSS } from "./styles";
import type { DockPosition, WishlistDockHandle } from "./types";
import type { Card, CreateCardRequest, Stack, ThemeMode } from "@/types";

export class WishlistDockElement extends HTMLElement {
  private shadow: ShadowRoot;

  private reactRoot: Root | null = null;
  private styleContainer: HTMLDivElement | null = null;
  private appContainer: HTMLDivElement | null = null;

  private handle: WishlistDockHandle | null = null;

  private _isReady = false;
  private _pendingOperations: Array<() => void> = [];

  private _theme: ThemeMode = "light";
  private _position: DockPosition = "bottom-center";

  static get observedAttributes(): string[] {
    return ["theme", "position", "open"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this._theme = this.getAttribute("theme") === "dark" ? "dark" : "light";
    this._position = this.parsePosition(this.getAttribute("position"));

    try {
      this.mount();
    } catch (error) {
      console.error("[wishlist-dock] Mount failed:", error);
      this.emit("error", { error });
    }
  }

  disconnectedCallback(): void {
    this.unmount();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;

    switch (name) {
      case "theme":
        this._theme = newValue === "dark" ? "dark" : "light";
        this.handle?.setTheme(this._theme);
        this.emit("theme-changed", { theme: this._theme });
        break;

      case "position":
        this._position = this.parsePosition(newValue);
        break;

      case "open": {
        const shouldBeOpen = newValue !== null;
        this.whenReady(() => {
          if (this.handle && shouldBeOpen !== this.handle.isExpanded()) {
            this.handle.setExpanded(shouldBeOpen);
          }
        });
        break;
      }
    }
  }

  private mount(): void {
    const swiperStyle = document.createElement("style");
    swiperStyle.textContent = SWIPER_CSS;
    this.shadow.appendChild(swiperStyle);

    this.styleContainer = document.createElement("div");
    this.styleContainer.id = "wishlist-dock-styles";
    this.shadow.appendChild(this.styleContainer);

    this.appContainer = document.createElement("div");
    this.appContainer.id = "wishlist-dock-app";
    this.shadow.appendChild(this.appContainer);

    this.reactRoot = createRoot(this.appContainer);
    this.renderReact();
  }

  private unmount(): void {
    this.reactRoot?.unmount();
    this.reactRoot = null;
    this.handle = null;
    this.styleContainer = null;
    this.appContainer = null;
    this._isReady = false;
    this._pendingOperations = [];
  }

  private renderReact(): void {
    if (!this.reactRoot || !this.styleContainer || !this.appContainer) return;

    this.reactRoot.render(
      createElement(WishlistDockRoot, {
        styleContainer: this.styleContainer,
        appContainer: this.appContainer,
        theme: this._theme,
        initialOpen: this.hasAttribute("open"),
        onReady: (handle: WishlistDockHandle) => this.handleReady(handle),
      }),
    );
  }

  private handleReady(handle: WishlistDockHandle): void {
    this.handle = handle;
    this._isReady = true;

    this._pendingOperations.forEach((op) => op());
    this._pendingOperations = [];

    this.emit("dock-ready");
  }

  private parsePosition(value: string | null): DockPosition {
    if (value === "bottom-left" || value === "bottom-right") {
      return value;
    }
    return "bottom-center";
  }

  private emit(type: string, detail?: unknown): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private whenReady(operation: () => void): void {
    if (this._isReady) {
      operation();
    } else {
      this._pendingOperations.push(operation);
    }
  }

  get theme(): ThemeMode {
    return this._theme;
  }

  set theme(value: ThemeMode) {
    if (this._theme !== value) {
      this.setAttribute("theme", value);
    }
  }

  get position(): DockPosition {
    return this._position;
  }

  set position(value: DockPosition) {
    if (this._position !== value) {
      this.setAttribute("position", value);
    }
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }

  set open(value: boolean) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  get isReady(): boolean {
    return this._isReady;
  }

  openDock(): void {
    this.open = true;
    this.whenReady(() => this.handle?.setExpanded(true));
  }

  closeDock(): void {
    this.open = false;
    this.whenReady(() => this.handle?.setExpanded(false));
  }

  toggle(): void {
    this.whenReady(() => {
      if (this.handle?.isExpanded()) {
        this.closeDock();
      } else {
        this.openDock();
      }
    });
  }

  async addCard(
    data: Omit<CreateCardRequest, "stackId"> & { stackId?: string },
  ): Promise<Card> {
    return new Promise((resolve, reject) => {
      this.whenReady(async () => {
        try {
          if (!this.handle) throw new Error("Widget not initialized");
          const card = await this.handle.addCard(data);
          resolve(card);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getStacks(): Stack[] {
    return this.handle?.getStacks() ?? [];
  }
}

export function register(tagName = "wishlist-dock"): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, WishlistDockElement);
  }
}
