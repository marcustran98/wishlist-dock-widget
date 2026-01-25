import { Box, IconButton, Button, TextField, InputAdornment } from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";

interface FullScreenHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onAddStack: () => void;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

export function FullScreenHeader({
  searchQuery,
  onSearchChange,
  onClose,
  onAddStack,
  themeMode,
  onToggleTheme,
}: FullScreenHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: { xs: 56, sm: 60, md: 64 },
        px: { xs: 1.5, sm: 2, md: 3 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="span"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span style={{ fontSize: "inherit" }}>*</span>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            plugilo
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
        <TextField
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter stacks..."
          size="small"
          sx={{
            width: { xs: 120, sm: 160, md: 200 },
            "& .MuiInputBase-input": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: { xs: 16, sm: 20 } }} color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddStack}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: { xs: 1, sm: 2 },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Create Stack
          </Box>
        </Button>

        <IconButton onClick={onToggleTheme} size="small">
          {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
