import { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DriveFileMove as MoveIcon,
} from "@mui/icons-material";
import type { Card, Stack } from "@/types";

interface CardThumbnailProps {
  card: Card;
  stacks: Stack[];
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (targetStackId: string) => void;
}

export function CardThumbnail({
  card,
  stacks,
  onClick,
  onEdit,
  onDelete,
  onMove,
}: CardThumbnailProps) {
  const theme = useTheme();
  const [moveAnchor, setMoveAnchor] = useState<null | HTMLElement>(null);
  const moveMenuOpen = Boolean(moveAnchor);

  const otherStacks = stacks.filter((s) => s.id !== card.stackId);

  const handleMoveClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMoveAnchor(e.currentTarget);
  };

  const handleMoveClose = () => {
    setMoveAnchor(null);
  };

  const handleMoveSelect = (stackId: string) => {
    onMove(stackId);
    handleMoveClose();
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: { xs: 120, sm: 140, md: 160 },
        height: { xs: 165, sm: 192, md: 220 },
        borderRadius: { xs: 1.5, md: 2 },
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        backgroundColor: "grey.800",
        backgroundImage: `url(${card.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 1, md: 1.5 },
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "common.white",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.name}
        </Typography>
      </Box>

      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          opacity: 0,
          transition: "opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          sx={{
            backgroundColor: alpha(theme.palette.common.white, 0.9),
            "&:hover": {
              backgroundColor: theme.palette.common.white,
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            backgroundColor: alpha(theme.palette.common.white, 0.9),
            color: "error.main",
            "&:hover": {
              backgroundColor: theme.palette.common.white,
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        {otherStacks.length > 0 && (
          <IconButton
            size="small"
            onClick={handleMoveClick}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.9),
              "&:hover": {
                backgroundColor: theme.palette.common.white,
              },
            }}
          >
            <MoveIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Menu
        anchorEl={moveAnchor}
        open={moveMenuOpen}
        onClose={handleMoveClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem disabled sx={{ opacity: 0.7 }}>
          <Typography variant="caption">Move to...</Typography>
        </MenuItem>
        {otherStacks.map((stack) => (
          <MenuItem key={stack.id} onClick={() => handleMoveSelect(stack.id)}>
            <ListItemIcon>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 0.5,
                  background: stack.coverUrl.startsWith("linear-gradient")
                    ? stack.coverUrl
                    : `url(${stack.coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </ListItemIcon>
            <ListItemText primary={stack.name} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
