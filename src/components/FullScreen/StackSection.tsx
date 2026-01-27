import { Box, Typography, IconButton, Badge, Button } from "@mui/material";
import {
  Add as AddIcon,
  OpenInFull as ExpandIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { CardThumbnail } from "./CardThumbnail";
import { EmptyState } from "./EmptyState";
import type { Card, Stack } from "@/types";

interface StackSectionProps {
  stack: Stack;
  cards: Card[];
  allStacks: Stack[];
  onAddCard: () => void;
  onExpandStack: () => void;
  onEditStack: () => void;
  onDeleteStack: () => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onMoveCard: (card: Card, targetStackId: string) => void;
  onCardClick: (cardIndex: number) => void;
}

export function StackSection({
  stack,
  cards,
  allStacks,
  onAddCard,
  onExpandStack,
  onEditStack,
  onDeleteStack,
  onEditCard,
  onDeleteCard,
  onMoveCard,
  onCardClick,
}: StackSectionProps) {
  return (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 1.5, md: 2 },
          px: { xs: 1.5, sm: 2.25, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          <Badge
            badgeContent={cards.length}
            color="primary"
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 44, md: 48 },
                height: { xs: 40, sm: 44, md: 48 },
                borderRadius: { xs: 1, md: 1.5 },
                background: stack.coverUrl.startsWith("linear-gradient")
                  ? stack.coverUrl
                  : `url(${stack.coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Badge>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              {stack.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={onEditStack}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDeleteStack} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onExpandStack}
            color="primary"
            title="Open card deck"
          >
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {cards.length === 0 ? (
        <EmptyState
          message="No cards in this stack"
          actionLabel="Add Card"
          onAction={onAddCard}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, md: 2 },
            overflowX: "auto",
            pb: { xs: 1.5, md: 2 },
            px: { xs: 1.5, sm: 2.25, md: 3 },
            "&::-webkit-scrollbar": {
              height: { xs: 6, md: 8 },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "action.hover",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "action.selected",
              borderRadius: 4,
            },
          }}
        >
          {cards.map((card, index) => (
            <CardThumbnail
              key={card.id}
              card={card}
              stacks={allStacks}
              onClick={() => onCardClick(index)}
              onEdit={() => onEditCard(card)}
              onDelete={() => onDeleteCard(card)}
              onMove={(targetStackId) => onMoveCard(card, targetStackId)}
            />
          ))}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 120, sm: 140, md: 160 },
              height: { xs: 165, sm: 192, md: 220 },
              borderRadius: { xs: 1.5, md: 2 },
              border: "2px dashed",
              borderColor: "divider",
              flexShrink: 0,
              cursor: "pointer",
              transition: "border-color 0.2s, background-color 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
            onClick={onAddCard}
          >
            <Button
              startIcon={<AddIcon />}
              color="primary"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              Add Card
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
