import { Box, Typography, IconButton, styled } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import type { Card as CardType } from "@/types";

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
  },
}));

interface CardProps {
  card: CardType;
  onDragHandlePointerDown?: (e: React.PointerEvent) => void;
  mode?: "deck" | "swiper";
  onEdit: () => void;
  width?: number;
  height?: number;
}

export function Card({
  card,
  onEdit,
  onDragHandlePointerDown,
  width,
  height,
}: CardProps) {
  const theme = useTheme();

  // Use custom dimensions if provided, otherwise responsive defaults
  const cardWidth = width ?? { xs: 240, sm: 260, md: 280 };
  const cardHeight = height ?? { xs: 340, sm: 370, md: 400 };

  return (
    <Box
      sx={{
        width: cardWidth,
        height: cardHeight,
        borderRadius: { xs: "12px", md: "16px" },
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${card.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)} 0%, transparent 100%)`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 12,
          display: "flex",
          gap: 1,
          zIndex: 1,
        }}
      >
        <ActionButton
          onClick={onEdit}
          size="small"
          aria-label={`Edit ${card.name}`}
        >
          <EditIcon fontSize="small" />
        </ActionButton>
      </Box>

      {/* Drag handle - shown in both modes when provided */}
      {onDragHandlePointerDown && (
        <Box
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDragHandlePointerDown(e);
          }}
          sx={{
            position: "absolute",
            bottom: { xs: 60, sm: 70, md: 80 },
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: alpha(theme.palette.common.white, 0.3),
            borderRadius: { xs: "6px", md: "8px" },
            padding: { xs: "4px 16px", md: "6px 20px" },
            cursor: "grab",
            touchAction: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s, transform 0.2s",
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.5),
              transform: "translateX(-50%) scale(1.05)",
            },
            "&:active": {
              cursor: "grabbing",
              transform: "translateX(-50%) scale(0.98)",
            },
          }}
        >
          <OpenWithIcon
            sx={{
              color: theme.palette.common.white,
              fontSize: { xs: 16, md: 18 },
            }}
          />
        </Box>
      )}

      {/* Card content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 1.5, md: 2 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.common.white,
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          {card.name}
        </Typography>
        {card.description && (
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              mt: 0.5,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
