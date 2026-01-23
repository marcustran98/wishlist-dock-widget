import { Box, Typography, Badge } from "@mui/material";
import { LAYOUT } from "@/constants";
import type { Stack } from "@/types";

interface StackThumbnailProps {
  stack: Stack;
  isActive: boolean;
  onClick: () => void;
}

export function StackThumbnail({ stack, isActive, onClick }: StackThumbnailProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        cursor: "pointer",
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
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
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
    </Box>
  );
}
