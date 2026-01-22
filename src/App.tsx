import { useState } from "react";
import { ThemeProvider, CssBaseline, Typography, Box } from "@mui/material";
import { createAppTheme } from "@/theme";
import { DockMinimized, DockExpanded } from "@/components/Dock";

const theme = createAppTheme("light");

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {isExpanded ? "Dock is expanded" : "Click the dock button below"}
        </Typography>
      </Box>
      {isExpanded ? (
        <DockExpanded
          onMinimize={() => setIsExpanded(false)}
          onAddStack={() => console.log("Add stack clicked")}
        />
      ) : (
        <DockMinimized onExpand={() => setIsExpanded(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;
