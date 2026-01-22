import { Box, Paper, IconButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import { LAYOUT, Z_INDEX } from "@/constants";
import { StackThumbnail } from "./StackThumbnail";
import { SearchBar } from "./SearchBar";

interface Stack {
  id: string;
  name: string;
  coverUrl: string;
  cardCount: number;
}

interface DockExpandedProps {
  stacks: Stack[];
  activeStackId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  onMinimize: () => void;
  onAddStack: () => void;
  onStackClick: (stackId: string) => void;
  onSearchChange: (value: string) => void;
  onSearchToggle: () => void;
  onSearchClose: () => void;
}

export function DockExpanded({
  stacks,
  activeStackId,
  searchQuery,
  isSearchOpen,
  onMinimize,
  onAddStack,
  onStackClick,
  onSearchChange,
  onSearchToggle,
  onSearchClose,
}: DockExpandedProps) {
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
        {stacks.map((stack) => (
          <StackThumbnail
            key={stack.id}
            stack={stack}
            isActive={activeStackId === stack.id}
            onClick={() => onStackClick(stack.id)}
          />
        ))}
        {stacks.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No stacks found
          </Typography>
        )}
      </Box>

      {/* Right: Action buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {isSearchOpen ? (
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClose={onSearchClose}
          />
        ) : (
          <>
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
            <IconButton color="default" onClick={onSearchToggle}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={onMinimize} color="default">
              <RemoveIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Paper>
  );
}
