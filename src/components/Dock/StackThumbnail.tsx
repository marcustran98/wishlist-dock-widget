import { useState } from "react";
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
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StackThumbnail({
  stack,
  isActive,
  onClick,
  onEdit,
  onDelete,
}: StackThumbnailProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

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
          sx={{
            width: LAYOUT.THUMBNAIL_SIZE,
            height: LAYOUT.THUMBNAIL_SIZE,
            borderRadius: "8px",
            background: stack.coverUrl,
            border: isActive ? "2px solid" : "2px solid transparent",
            borderColor: isActive ? "primary.main" : "transparent",
            transition: "border-color 0.2s, transform 0.2s",
            position: "relative",
            "&:hover": {
              transform: "scale(1.05)",
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
