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
        component="div"
        badgeContent={stack.cardCount}
        color="primary"
        sx={{
          "& .MuiBadge-badge": {
            top: 2,
            right: 2,
            fontSize: { xs: 8, md: 10 },
            minWidth: { xs: 14, md: 18 },
            height: { xs: 14, md: 18 },
          },
        }}
      >
        {/* Outer container with border */}
        <Box
          ref={thumbnailRef}
          sx={{
            width: { xs: 48, sm: 56, md: 64 },
            height: { xs: 54, sm: 62, md: 70 },
            borderRadius: { xs: "8px", md: "10px" },
            border: "2px solid",
            borderColor: isActive
              ? "primary.main"
              : alpha(theme.palette.grey[400], 0.6),
            transition: "all 0.2s ease-in-out",
            position: "relative",
            overflow: "hidden",
            transform: isDropTarget ? "scale(1.08)" : "scale(1)",
            backgroundColor: alpha(theme.palette.grey[200], 0.3),
            boxShadow: isActive
              ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
              : `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,

            "&:hover": {
              transform: isDropTarget ? "scale(1.1)" : "scale(1.02)",
              borderColor: isActive
                ? "primary.main"
                : alpha(theme.palette.grey[500], 0.8),
              boxShadow: isActive
                ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                : `0 4px 12px ${alpha(theme.palette.common.black, 0.12)}`,
            },

            ...(isDropTarget && {
              borderColor: alpha(theme.palette.primary.main, 0.6),
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            }),

            ...(isHoveredDuringDrag && {
              borderColor: theme.palette.primary.main,
              transform: "scale(1.15)",
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.4)}, 0 0 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                transform: "scale(1.15)",
              },
            }),
          }}
        >
          {/* Inner main area with background */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: { xs: 4, md: 6 },
              background: stack.coverUrl,
              borderRadius: { xs: "6px 6px 4px 4px", md: "8px 8px 6px 6px" },
              borderBottom: "1px solid",
              borderBottomColor: alpha(theme.palette.grey[400], 0.4),
            }}
          />
        </Box>
      </Badge>
      {/* Stack name with menu button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          maxWidth: { xs: 64, sm: 72, md: 80 },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
          }}
          noWrap
        >
          {stack.name}
        </Typography>
        <IconButton
          className="menu-button"
          size="small"
          onClick={handleMenuClick}
          sx={{
            opacity: 0,
            transition: "opacity 0.2s",
            padding: "2px",
            color: "text.secondary",
            "&:hover": {
              color: "text.primary",
              backgroundColor: alpha(theme.palette.action.hover, 0.1),
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
        </IconButton>
      </Box>

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
