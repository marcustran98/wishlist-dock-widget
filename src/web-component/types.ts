import type { Card, Stack, CreateCardRequest, ThemeMode } from "@/types";

export type DockPosition = "bottom-center" | "bottom-left" | "bottom-right";

export interface WishlistDockEventMap {
  "dock-ready": CustomEvent<void>;
  "theme-changed": CustomEvent<{ theme: ThemeMode }>;
}

export interface WishlistDockHandle {
  setExpanded: (expanded: boolean) => void;
  isExpanded: () => boolean;
  setTheme: (theme: ThemeMode) => void;
  addCard: (
    data: Omit<CreateCardRequest, "stackId"> & { stackId?: string },
  ) => Promise<Card>;
  getStacks: () => Stack[];
}
