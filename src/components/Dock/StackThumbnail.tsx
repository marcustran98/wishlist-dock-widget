import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LAYOUT } from "@/constants";
import type { Stack } from "@/types";

interface StackThumbnailProps {
  stack: Stack;
  isActive: boolean;
  isDropTarget?: boolean;
  isHoveredDuringDrag?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRegisterDropZone?: (stackId: string, element: HTMLElement | null) => void;
}

export function StackThumbnail({
  stack,
  isActive,
  isDropTarget = false,
  isHoveredDuringDrag = false,
  onClick,
  onEdit,
  onDelete,
  onRegisterDropZone,
}: StackThumbnailProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Register this element as a drop zone
  useEffect(() => {
    onRegisterDropZone?.(stack.id, thumbnailRef.current);
    return () => {
      onRegisterDropZone?.(stack.id, null);
    };
  }, [stack.id, onRegisterDropZone]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onEdit();
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose();
    onDelete();
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        cursor: "pointer",
        position: "relative",
        "&:hover .menu-button": {
          opacity: 1,
        },
      }}
    >
      <Badge
        badgeContent={stack.cardCount}
        color="primary"
        sx={{
          "& .MuiBadge-badge": {
            top: 4,
            right: 4,
            fontSize: 10,
            minWidth: 18,
            height: 18,
          },
        }}
      >
        <Box
          ref={thumbnailRef}
          sx={{
            width: LAYOUT.THUMBNAIL_SIZE,
            height: LAYOUT.THUMBNAIL_SIZE,
            borderRadius: "8px",
            background: stack.coverUrl,
            border: isActive ? "2px solid" : "2px solid transparent",
            borderColor: isActive
              ? "primary.main"
              : isHoveredDuringDrag
                ? "primary.main"
                : isDropTarget
                  ? alpha(theme.palette.primary.main, 0.5)
                  : "transparent",
            transition:
              "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
            position: "relative",
            transform: isHoveredDuringDrag
              ? "scale(1.15)"
              : isDropTarget
                ? "scale(1.08)"
                : "scale(1)",
            boxShadow: isHoveredDuringDrag
              ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.4)}, 0 0 16px ${alpha(theme.palette.primary.main, 0.3)}`
              : isDropTarget
                ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                : "none",
            "&:hover": {
              transform: isHoveredDuringDrag
                ? "scale(1.15)"
                : isDropTarget
                  ? "scale(1.1)"
                  : "scale(1.05)",
            },
          }}
        >
          <IconButton
            className="menu-button"
            size="small"
            onClick={handleMenuClick}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              opacity: 0,
              transition: "opacity 0.2s",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "2px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Badge>
      <Typography
        variant="caption"
        sx={{
          maxWidth: LAYOUT.THUMBNAIL_SIZE,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        {stack.name}
      </Typography>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              minWidth: 160,
              boxShadow: theme.shadows[8],
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            py: 0.5,
            px: 1,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            slotProps={{
              primary: {
                variant: "body2",
                fontWeight: 500,
              },
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleDelete}
          sx={{
            py: 0.5,
            px: 1,
            color: "error.main",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            slotProps={{
              primary: {
                variant: "body2",
                fontWeight: 500,
                color: "error.main",
              },
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
