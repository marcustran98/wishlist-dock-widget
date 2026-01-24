import { useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline, IconButton } from "@mui/material";
import { store } from "@/store";
import { createAppTheme } from "@/theme";
import { Dock } from "@/components/Dock";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

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
        <IconButton
          onClick={toggleTheme}
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
        <Dock />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
