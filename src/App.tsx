import { useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline, Typography, Box, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { store } from "@/store";
import { createAppTheme } from "@/theme";
import { Dock } from "@/components/Dock";

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Click the dock button below
          </Typography>
        </Box>
        <Dock />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
