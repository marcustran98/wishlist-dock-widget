import { useState } from "react";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { store, type RootState } from "@/store";
import { createAppTheme } from "@/theme";
import { Dock } from "@/components/Dock";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function ThemeToggleButton({
  mode,
  onToggle,
}: {
  mode: "light" | "dark";
  onToggle: () => void;
}) {
  const isFullScreen = useSelector((state: RootState) => state.ui.isFullScreen);

  if (isFullScreen) return null;

  return (
    <IconButton
      onClick={onToggle}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createAppTheme(mode);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeToggleButton mode={mode} onToggle={toggleTheme} />
        <Dock themeMode={mode} onToggleTheme={toggleTheme} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
