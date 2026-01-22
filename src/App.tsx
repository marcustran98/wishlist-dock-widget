import { ThemeProvider, CssBaseline, Typography, Box } from "@mui/material";
import { createAppTheme } from "@/theme";
import { Dock } from "@/components/Dock";

const theme = createAppTheme("light");

function App() {
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
          Click the dock button below
        </Typography>
      </Box>
      <Dock />
    </ThemeProvider>
  );
}

export default App;
