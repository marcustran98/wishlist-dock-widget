import { Box, Typography, IconButton, styled } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { CARD_DECK } from "@/constants";
import type { Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  onEdit: () => void;
  onDelete: () => void;
  onDragHandlePointerDown?: (e: React.PointerEvent) => void;
}

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
  },
}));

export function Card({
  card,
  onEdit,
  onDelete,
  onDragHandlePointerDown,
}: CardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: CARD_DECK.CARD_WIDTH,
        height: CARD_DECK.CARD_HEIGHT,
        borderRadius: "16px",
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

      {/* Action buttons */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1,
        }}
      >
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          size="small"
          aria-label={`Edit ${card.name}`}
        >
          <EditIcon fontSize="small" />
        </ActionButton>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="small"
          aria-label={`Delete ${card.name}`}
        >
          <DeleteIcon fontSize="small" />
        </ActionButton>
      </Box>

      {/* Drag handle */}
      {onDragHandlePointerDown && (
        <Box
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDragHandlePointerDown(e);
          }}
          sx={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: alpha(theme.palette.common.white, 0.3),
            borderRadius: "8px",
            padding: "6px 20px",
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
          <OpenWithIcon sx={{ color: theme.palette.common.white, fontSize: 18 }} />
        </Box>
      )}

      {/* Card content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.palette.common.white, fontWeight: 600 }}
        >
          {card.name}
        </Typography>
        {card.description && (
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              mt: 0.5,
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
