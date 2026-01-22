import { ThemeProvider, CssBaseline, Typography, Box } from '@mui/material';
import { createAppTheme } from '@/theme';

const theme = createAppTheme('light');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" color="primary">
          Wishlist Dock
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
