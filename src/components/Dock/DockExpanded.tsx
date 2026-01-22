import { Box, Paper, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import { LAYOUT, Z_INDEX } from "@/constants";

interface DockExpandedProps {
  onMinimize: () => void;
  onAddStack: () => void;
}

export function DockExpanded({ onMinimize, onAddStack }: DockExpandedProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: LAYOUT.DOCK_HEIGHT,
        zIndex: Z_INDEX.DOCK,
        display: "flex",
        alignItems: "center",
        px: 2,
        borderRadius: "16px 16px 0 0",
      }}
    >
      {/* Left: Logo - click to minimize */}
      <Box
        onClick={onMinimize}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          color: "primary.main",
          mr: 2,
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <StarIcon />
        <Typography variant="body1" fontWeight={600}>
          plugilo
        </Typography>
      </Box>

      {/* Center: Stack thumbnails area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">Stack thumbnails here</Typography>
      </Box>

      {/* Right: Action buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          onClick={onAddStack}
          color="primary"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton color="default">
          <SearchIcon />
        </IconButton>
        <IconButton onClick={onMinimize} color="default">
          <RemoveIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
