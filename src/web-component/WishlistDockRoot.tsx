import { useState, useEffect, useMemo, useRef } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, ScopedCssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { createStore } from "@/store";
import { createAppTheme, createEmotionCache } from "@/theme";
import { Dock } from "@/components/Dock";
import { apiSlice } from "@/store/api/apiSlice";
import type { ThemeMode } from "@/types";
import type { WishlistDockHandle } from "./types";

interface WishlistDockRootProps {
  styleContainer: HTMLElement;
  appContainer: HTMLElement;
  theme: ThemeMode;
  initialOpen: boolean;
  onReady: (handle: WishlistDockHandle) => void;
}

export function WishlistDockRoot({
  styleContainer,
  appContainer,
  theme,
  initialOpen,
  onReady,
}: WishlistDockRootProps) {
  const [mode, setMode] = useState<ThemeMode>(theme);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const store = useMemo(() => createStore(), []);

  // Emotion cache (stable)
  const emotionCache = useMemo(
    () => createEmotionCache(styleContainer),
    [styleContainer],
  );

  const muiTheme = useMemo(() => {
    const baseTheme = createAppTheme(mode);
    return {
      ...baseTheme,
      components: {
        ...baseTheme.components,
        MuiPopover: { defaultProps: { container: appContainer } },
        MuiPopper: { defaultProps: { container: appContainer } },
        MuiDialog: { defaultProps: { container: appContainer } },
        MuiModal: { defaultProps: { container: appContainer } },
        MuiMenu: { defaultProps: { container: appContainer } },
      },
    };
  }, [mode, appContainer]);

  useEffect(() => {
    setMode(theme);
  }, [theme]);

  useEffect(() => {
    if (initialOpen) {
      store.dispatch({ type: "ui/setExpanded", payload: true });
    }
  }, [store, initialOpen]);

  useEffect(() => {
    const handle: WishlistDockHandle = {
      setExpanded: (expanded: boolean) => {
        store.dispatch({ type: "ui/setExpanded", payload: expanded });
      },
      isExpanded: () => store.getState().ui.isExpanded,
      setTheme: (newTheme: ThemeMode) => setMode(newTheme),
      addCard: async (data) => {
        const state = store.getState();
        const stacks = apiSlice.endpoints.getStacks.select()(state).data ?? [];

        let targetStackId = data.stackId;
        if (!targetStackId && stacks.length > 0) {
          targetStackId = stacks[0].id;
        }

        if (!targetStackId) {
          throw new Error("No stack available. Create a stack first.");
        }

        const result = await store.dispatch(
          apiSlice.endpoints.createCard.initiate({
            name: data.name,
            description: data.description,
            coverUrl: data.coverUrl,
            stackId: targetStackId,
          }),
        );

        if ("data" in result && result.data) {
          return result.data;
        }

        throw new Error("Failed to create card");
      },
      getStacks: () => {
        const state = store.getState();
        return apiSlice.endpoints.getStacks.select()(state).data ?? [];
      },
    };

    onReadyRef.current(handle);
  }, [store]);

  const handleToggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <ThemeProvider theme={muiTheme}>
          <ScopedCssBaseline
            enableColorScheme
            sx={{
              backgroundColor: "transparent",
              minHeight: "auto",
            }}
          >
            <Dock
              themeMode={mode}
              onToggleTheme={handleToggleTheme}
              portalContainer={appContainer}
            />
          </ScopedCssBaseline>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
