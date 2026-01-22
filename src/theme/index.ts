import { createTheme, type Theme } from "@mui/material/styles";
import createCache from "@emotion/cache";
import type { EmotionCache } from "@emotion/cache";

export type ThemeMode = "light" | "dark";

const systemFonts = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(",");

export function createAppTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    typography: {
      fontFamily: systemFonts,
    },
  });
}

export function createEmotionCache(container: HTMLElement): EmotionCache {
  return createCache({
    key: "wishlist-dock",
    container,
    prepend: true,
  });
}
