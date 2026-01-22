import { useState } from "react";
import { Box, Paper, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import { LAYOUT, Z_INDEX, GRADIENTS } from "@/constants";
import { StackThumbnail } from "./StackThumbnail";

interface Stack {
  id: string;
  name: string;
  coverUrl: string;
  cardCount: number;
}

const mockStacks: Stack[] = [
  { id: "1", name: "Favorites", coverUrl: GRADIENTS[0], cardCount: 3 },
  { id: "2", name: "Read Later", coverUrl: GRADIENTS[1], cardCount: 5 },
  { id: "3", name: "Shopping", coverUrl: GRADIENTS[2], cardCount: 2 },
];

interface DockExpandedProps {
  onMinimize: () => void;
  onAddStack: () => void;
}

export function DockExpanded({ onMinimize, onAddStack }: DockExpandedProps) {
  const [activeStackId, setActiveStackId] = useState<string | null>(null);

  const handleStackClick = (stackId: string) => {
    setActiveStackId((prev) => (prev === stackId ? null : stackId));
  };

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
          gap: `${LAYOUT.THUMBNAIL_GAP}px`,
          overflowX: "auto",
          py: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {mockStacks.map((stack) => (
          <StackThumbnail
            key={stack.id}
            stack={stack}
            isActive={activeStackId === stack.id}
            onClick={() => handleStackClick(stack.id)}
          />
        ))}
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
